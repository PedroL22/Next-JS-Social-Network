import React from "react";
import Image from "next/image";
import moment from "moment";

export default function Post({ text, date, ownerName, ownerImage }) {
  const dateString = moment(date).format("MMMM Do YYYY, h:mm a");

  return (
    <div className="flex">
      <div className="mx-auto bg-white h-32 w-96 my-5 rounded-sm shadow-md p-5">
        <div className="flex">
          <div className="rounded-full">
            <Image src={ownerImage} width={48} height={48} />
          </div>
          <div>
            <h1 className="ml-3 font-medium">{ownerName}</h1>
            <h1 className="ml-3 text-gray-500">{dateString}</h1>
          </div>
        </div>

        <h1 className="my-5"> {text}</h1>
      </div>
    </div>
  );
}
