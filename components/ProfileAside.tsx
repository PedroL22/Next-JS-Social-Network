import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function ProfileAside() {
  const { data: session }: any = useSession({ required: true });

  const router = useRouter();

  return (
    <div className="bg-white max-w-xs p-10 rounded-xl fixed">
      <div className="flex">
        <Image
          src={session?.user?.image}
          alt={session?.user?.name + "profile picture"}
          className="rounded-full cursor-pointer mr-2"
          width={65}
          height={65}
          onClick={() => router.push("/account")}
        />
        <div className="mt-3">
          <p className="font-medium">{session?.user?.name}</p>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>
      </div>
      <p className="text-sm my-4">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum, at a
        blanditiis ipsa cumque aliquam animi optio repellat consequuntur velit,
        placeat, nesciunt saepe nostrum vero reprehenderit veritatis adipisci
        numquam aperiam?
      </p>
      <div className="flex justify-around gap-20">
        <div>
          <p className="text-sm font-medium">Posts</p>
          <p className="text-sm">10</p>
        </div>
        <div>
          <p className="text-sm font-medium">Comments</p>
          <p className="text-sm">20</p>
        </div>
      </div>
    </div>
  );
}
