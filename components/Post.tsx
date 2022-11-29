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
  comments,
  likes,
}: any) {
  const { data: session } = useSession({ required: true });
  const postDate = moment(date).format("MMMM Do YYYY, h:mm a");
  const [postText, setPostText] = useState("");
  const [commentTextState, setCommentTextState] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);

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
      setIsEditingPost(false);
    }
  }

  async function handleDeletePost() {
    await api.post("/api/posts/delete", {
      id: id,
    });

    setIsEditingPost(false);
  }

  async function handleCreateComment(event: FormEvent) {
    event.preventDefault();

    await api.post("/api/comments/create", {
      postsId: id,
      text: commentTextState,
      email: session?.user?.email,
    });

    setIsEditingComment(false);
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
                  onClick={() => setIsEditingPost(true)}
                />
                <BsFillTrashFill
                  className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={handleDeletePost}
                />
              </div>
            ) : null}
          </div>
        </div>

        {isEditingPost === false ? (
          <h1 className="my-5">{text}</h1>
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
              Edit
            </button>
          </form>
        )}
        <div>
          {isEditingComment === false ? (
            <>
              {Object.entries(comments).map(([key, value]: any) => {
                return (
                  <div key={key} className="my-6">
                    <div className="flex">
                      <div className="flex justify-between">
                        <Image
                          src={value[1]}
                          width={40}
                          height={40}
                          className="w-[40px] h-[40px] rounded-full"
                          alt={value[0] + "profile picture"}
                        />
                        <div>
                          <h4 className="ml-3 font-medium">{value[0]}</h4>
                          <p className="ml-3 text-gray-500">
                            {moment(value[2].toString()).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </p>
                        </div>
                        {value[4] === session?.user?.email ? (
                          <div className="flex -ml-6">
                            <MdModeEditOutline
                              className="xl:ml-10 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                              onClick={() => setIsEditingPost(true)}
                            />
                            <BsFillTrashFill
                              className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                              onClick={handleDeleteComment}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <h3>{value[3]}</h3>
                  </div>
                );
              })}
              <button
                onClick={() => setIsEditingComment(true)}
                className="block my-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
              >
                Comment
              </button>
            </>
          ) : (
            <form onSubmit={handleCreateComment} className="mx-auto">
              <input
                type="text"
                value={commentTextState}
                onChange={(e: any) => setCommentTextState(e.target.value)}
                className="bg-gray-white pl-4 xl:pr-44 pr-36 pt-4 pb-10 rounded-md outline-0 border focus:border-gray-400"
                placeholder="Comment something..."
              />
              <button
                type="submit"
                className="block my-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
              >
                Comment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
