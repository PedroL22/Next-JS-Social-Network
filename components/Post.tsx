import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";

export default function Post({
  text,
  date,
  ownerName,
  ownerImage,
  ownerEmail,
}) {
  const { data: session } = useSession({ required: true });
  const dateString = moment(date).format("MMMM Do YYYY, h:mm a");
  const [postText, setPostText] = useState();

  async function handleEditPost(event: FormEvent) {
    event.preventDefault();

    await fetch("http://localhost:3000/api/posts/edit", {
      method: "POST",
      body: JSON.stringify({ text: postText, email: session.user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
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
            />

            <div>
              <h1 className="ml-3 font-medium">{ownerName}</h1>
              <p className="ml-3 text-gray-500 whitespace-nowrap">
                {dateString}
              </p>
            </div>
            {ownerEmail === session?.user?.email ? (
              <div className="flex">
                <MdModeEditOutline className="ml-10 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in" />
                <BsFillTrashFill className="ml-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in" />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <p className="my-5"> {text}</p>
      </div>
    </div>
  );
}
