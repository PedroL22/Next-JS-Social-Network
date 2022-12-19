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
  const { data: session }: any = useSession();

  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-700 max-w-xs p-10 rounded-xl fixed shadow">
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
            <p className="font-medium text-black dark:text-white whitespace-nowrap">
              {session?.user?.name.length > 18
                ? session?.user?.name.substring(0, 18) + "..."
                : session?.user?.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-200 whitespace-nowrap">
              {session?.user?.email.length > 22
                ? session?.user?.email.substring(0, 22) + "..."
                : session?.user?.email}
            </p>
          </div>
        </Link>
      </div>
      {bio ? (
        <p className="text-sm my-4 text-black dark:text-white">
          {bio.length > 500 ? bio.substring(0, 500) + "..." : bio}
        </p>
      ) : (
        <p className="text-sm my-4 text-black dark:text-white">
          No biography yet.
        </p>
      )}
      <div className="flex justify-around gap-10">
        <div>
          <p className="text-sm font-medium text-black dark:text-white">
            Posts
          </p>
          <p className="text-sm text-center text-black dark:text-white">
            {postsCount}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-black dark:text-white">
            Comments
          </p>
          <p className="text-sm text-center text-black dark:text-white">
            {commentsCount}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-black dark:text-white">
            Likes
          </p>
          <p className="text-sm text-center text-black dark:text-white">
            {likesCount}
          </p>
        </div>
      </div>
    </div>
  );
}
