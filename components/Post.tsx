import React from "react";
import Image from "next/image";

export default function Post({ text, date, ownerName, ownerImage }) {
  return (
    <div className="flex">
      <div className="mx-auto bg-white h-32 w-32">
        <Image src={ownerImage} width={100} height={100} />
        <h1> {ownerName}</h1>
        <h1> {date}</h1>
        <h1> {text}</h1>
      </div>
    </div>
  );
}
