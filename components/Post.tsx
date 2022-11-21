import React, { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";

export default function Post({
  id,
  text,
  date,
  ownerName,
  ownerImage,
  ownerEmail,
}) {
  const { data: session } = useSession({ required: true });
  const dateString = moment(date).format("MMMM Do YYYY, h:mm a");
  const [postText, setPostText] = useState();
  const [isEditing, setIsEditing] = useState(false);

  async function handleEditPost(event: FormEvent) {
    event.preventDefault();

    await fetch("http://localhost:3000/api/posts/edit", {
      method: "POST",
      body: JSON.stringify({ text: postText, id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsEditing(false);
  }

  async function handleDeletePost() {
    await fetch("http://localhost:3000/api/posts/delete", {
      method: "POST",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
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
              <h1 className="ml-3 font-medium">{ownerName}</h1>
              <p className="ml-3 text-gray-500 whitespace-nowrap">
                {dateString}
              </p>
            </div>
            {ownerEmail === session?.user?.email ? (
              <div className="flex">
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
          <p className="my-5"> {text}</p>
        ) : (
          <form onSubmit={handleEditPost} className="mx-auto">
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
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
      </div>
    </div>
  );
}
