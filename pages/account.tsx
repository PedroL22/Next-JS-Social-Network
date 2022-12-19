import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import Post from "../components/Post";
import { prisma } from "../lib/prisma";
import { GetServerSideProps } from "next";
import api from "../lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Account({ posts, aside }: any) {
  const { data: session }: any = useSession({ required: true });
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState();
  const [bio, setBio] = useState();

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const notify = (notif: string) => toast.success(notif);
  const notifyError = (notif: string) => toast.error(notif);

  const editProfile = () => {
    try {
      name !== ""
        ? api.post("/api/username/edit", {
            email: session?.user?.email,
            name: name,
          })
        : notifyError("Name can't be empty.");

      bio !== ""
        ? api.post("/api/bio/edit", {
            email: session?.user?.email,
            bio: bio,
          })
        : notifyError("Bio can't be empty.");
    } catch (e) {
      console.error(e);
    } finally {
      name === ""
        ? null
        : bio === ""
        ? null
        : notify("Profile update successfully.");
      refreshData();
      setIsEditing(false);
    }
  };

  const cancel = () => {
    setIsEditing(false);
    refreshData();
  };

  if (session) {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 min-h-screen">
        <Head>
          <title>
            {session?.user?.name.length > 25
              ? session?.user?.name.substring(0, 25) + "..."
              : session?.user?.name}{" "}
            - Next JS Social Network
          </title>
          <meta
            name="description"
            content="A Next JS social network prototype built with Tailwind CSS, Daisy UI and Prisma."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="md:flex md:max-w-7xl md:mx-auto md:justify-around xl:flex xl:max-w-7xl xl:mx-auto xl:justify-around block">
          <div className="md:flex xl:flex pt-16">
            {isEditing === false ? (
              <div>
                <div className="bg-white dark:bg-gray-700 max-w-xs p-10 rounded-xl shadow mx-auto mt-4 h-fit">
                  <div className="flex">
                    {session?.user?.image && (
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name + " profile picture"}
                        className="rounded-full cursor-pointer mr-2"
                        width={65}
                        height={65}
                      />
                    )}

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
                  </div>
                  {aside.bio ? (
                    <p className="text-sm my-4 text-black dark:text-white">
                      {aside.bio.length > 500
                        ? aside.bio.substring(0, 500) + "..."
                        : aside.bio}
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
                        {aside._count.posts}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        Comments
                      </p>
                      <p className="text-sm text-center text-black dark:text-white">
                        {aside._count.Comments}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        Likes
                      </p>
                      <p className="text-sm text-center text-black dark:text-white">
                        {aside._count.Likes}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-evenly">
                    <Link href="/">
                      <button className="mt-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in">
                        Back
                      </button>
                    </Link>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 bg-gray-400 hover:bg-gray-500 active:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600 dark:active:bg-gray-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-white dark:bg-gray-700 max-w-xs p-10 rounded-xl shadow mx-auto mt-4 h-fit">
                  <div className="flex">
                    {session?.user?.image && (
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name + " profile picture"}
                        className="rounded-full cursor-pointer mr-2"
                        width={65}
                        height={65}
                      />
                    )}

                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        defaultValue={session?.user?.name}
                        className="bg-gray-200 dark:bg-gray-600 px-2 w-40 rounded-md outline-none border dark:border-none dark:text-white focus:border-gray-400"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-200">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>

                  <textarea
                    placeholder="Write a biography..."
                    value={bio}
                    onChange={(e: any) => setBio(e.target.value)}
                    defaultValue={aside.bio}
                    className="my-2 p-2 h-20 w-full text-sm rounded-md resize-none bg-gray-200 dark:bg-gray-600 outline-none border dark:border-none dark:text-white focus:border-gray-400"
                  />

                  <div className="flex justify-around gap-10">
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        Posts
                      </p>
                      <p className="text-sm text-center text-black dark:text-white">
                        {aside._count.posts}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        Comments
                      </p>
                      <p className="text-sm text-center text-black dark:text-white">
                        {aside._count.Comments}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        Likes
                      </p>
                      <p className="text-sm text-center text-black dark:text-white">
                        {aside._count.Likes}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-evenly">
                    <button
                      onClick={editProfile}
                      className="mt-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancel}
                      className="mt-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              {posts
                .filter((item: any) =>
                  item.ownerEmail.includes(session.user.email)
                )
                .sort((a: any, b: any) => (a.date < b.date ? 1 : -1))
                .map((item: any) => (
                  <div key={item.id}>
                    <Post
                      id={item.id}
                      ownerId={item.ownerId}
                      ownerEmail={item.ownerEmail}
                      ownerName={item.ownerName}
                      ownerImage={item.ownerImage}
                      text={item.text}
                      date={item.date}
                      comments={item.comments}
                      likesCount={item.likesCount}
                      likesData={item.likesData}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Head>
          <title>Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="xl:flex block xl:max-w-7xl xl:mx-auto">
          <div className="pt-20 ml-5">
            <p>...</p>
          </div>
        </div>
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const aside = session
    ? await prisma.user.findUnique({
        where: {
          email: session?.user?.email as string,
        },
        select: {
          bio: true,
          _count: {
            select: { posts: true, Comments: true, Likes: true },
          },
        },
      })
    : null;

  const posts = await prisma.posts.findMany({
    include: {
      User: true,
      Likes: {
        where: {
          email: { email: { contains: session?.user?.email as string } },
        },
      },
      _count: {
        select: {
          Likes: true,
        },
      },
      postComments: { include: { User: true } },
    },
  });

  const data: any = posts.map((post: any) => {
    return {
      id: post.id,
      text: post.text,
      date: post.createdAt.toISOString(),
      ownerId: post.User?.id,
      ownerName: post.User?.name,
      ownerImage: post.User?.image,
      ownerEmail: post.email,

      comments: post.postComments,

      likesCount: post._count.Likes,
      likesData: post.Likes,
    };
  });

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data)),
      aside: aside,
    },
  };
};
