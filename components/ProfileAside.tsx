import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface AsideProps {
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  bio: string;
}

export default function ProfileAside({
  postsCount,
  commentsCount,
  likesCount,
  bio,
}: AsideProps) {
  const { data: session }: any = useSession({ required: true });

  const router = useRouter();

  return (
    <div className="bg-white max-w-xs p-10 rounded-xl fixed shadow">
      <div className="flex">
        {session?.user?.image && (
          <Image
            src={session?.user?.image}
            alt={session?.user?.name + " profile picture"}
            className="rounded-full cursor-pointer mr-2"
            width={65}
            height={65}
            onClick={() => router.push("/account")}
          />
        )}
        <Link href="/account">
          <div className="mt-3">
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </Link>
      </div>
      {bio ? (
        <p className="text-sm my-4">{bio}</p>
      ) : (
        <p className="text-sm my-4">No biography yet.</p>
      )}
      <div className="flex justify-around gap-10">
        <div>
          <p className="text-sm font-medium">Posts</p>
          <p className="text-sm text-center">{postsCount}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Comments</p>
          <p className="text-sm text-center">{commentsCount}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Likes</p>
          <p className="text-sm text-center">{likesCount}</p>
        </div>
      </div>
    </div>
  );
}
