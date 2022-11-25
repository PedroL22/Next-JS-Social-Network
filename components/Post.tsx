import React, { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import api from "../lib/axios";

export default function Post({
  id,
  text,
  date,
  ownerId,
  ownerName,
  ownerImage,
  ownerEmail,
  commentOwnerName,
  commentOwnerImage,
  commentDate,
  commentText,
}: any) {
  const { data: session } = useSession({ required: true });
  const postDate = moment(date).format("MMMM Do YYYY, h:mm a");
  const commentDateString = moment(commentDate.toString()).format(
    "MMMM Do YYYY, h:mm a"
  );
  const [postText, setPostText] = useState();
  const [isEditing, setIsEditing] = useState(false);

  async function handleEditPost(event: FormEvent) {
    event.preventDefault();

    try {
      await api.post("/api/posts/edit", {
        text: postText,
        id: id,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditing(false);
    }
  }

  async function handleDeletePost() {
    await api.post("/api/posts/delete", {
      id: id,
    });

    setIsEditing(false);
  }

  return (
    <div className="flex px-4">
      <div className="mx-auto bg-white h-auto w-96 my-4 rounded-sm shadow-md p-5">
        <div className="justify-between">
          <div className="flex">
            <Image
              src={ownerImage}
              width={48}
              height={48}
              className="rounded-full"
              alt="profile picture"
            />

            <div>
              <Link href={"accounts/" + ownerId}>
                <h2 className="ml-3 font-medium">{ownerName}</h2>
              </Link>
              <p className="ml-3 text-gray-500 whitespace-nowrap">{postDate}</p>
            </div>
            {ownerEmail === session?.user?.email ? (
              <div className="flex -ml-6">
                <MdModeEditOutline
                  className="xl:ml-10 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={() => setIsEditing(true)}
                />
                <BsFillTrashFill
                  className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={handleDeletePost}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        {isEditing === false ? (
          <h1 className="my-5"> {text}</h1>
        ) : (
          <form onSubmit={handleEditPost} className="mx-auto">
            <input
              type="text"
              value={postText}
              onChange={(e: any) => setPostText(e.target.value)}
              className="bg-gray-white pl-4 xl:pr-44 pr-36 pt-4 pb-10 rounded-md outline-0 border focus:border-gray-400"
              placeholder="Write something..."
              defaultValue={text}
            />
            <button
              type="submit"
              className="block my-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
            >
              Post
            </button>
          </form>
        )}
        <div>
          <div className="flex">
            {commentOwnerImage.length > 0 ? (
              <Image
                src={commentOwnerImage[0]}
                width={40}
                height={40}
                className="w-[40px] h-[40px] rounded-full"
                alt={commentOwnerName + "profile picture"}
              />
            ) : null}
            <div className="block">
              <h4 className="ml-3 font-medium">{commentOwnerName}</h4>
              {commentDateString !== "Invalid date" ? (
                <p className="ml-3 text-gray-500">{commentDateString}</p>
              ) : null}
            </div>
          </div>

          <h3>{commentText}</h3>
        </div>
      </div>
    </div>
  );
}
