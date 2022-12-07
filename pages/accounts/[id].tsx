import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import api from "../../lib/axios";
import Post from "../../components/Post";

export const getServerSideProps = async (context: any) => {
  const id = context.params.id;
  const fetch = await api.get("/api/users/" + id);
  const res = await fetch.data;

  return {
    props: {
      data: res,
    },
  };
};

export default function Details({ data }: any) {
  const { data: session } = useSession({ required: true });

  if (session)
    return (
      <div className="bg-gray-200 dark:bg-gray-800 min-h-screen">
        <Head>
          <title>{data?.user?.name} - Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="md:flex md:max-w-7xl md:mx-auto md:justify-around xl:flex xl:max-w-7xl xl:mx-auto xl:justify-around block">
          <div className="md:flex xl:flex pt-16">
            <div className="bg-white dark:bg-gray-700 max-w-xs p-10 rounded-xl shadow mx-auto mt-4 h-fit">
              <div className="flex">
                {data?.user?.image && (
                  <Image
                    src={data?.user?.image}
                    alt={data?.user?.name + " profile picture"}
                    className="rounded-full cursor-pointer mr-2"
                    width={65}
                    height={65}
                  />
                )}

                <div className="mt-3">
                  <p className="font-medium text-black dark:text-white">
                    {data?.user?.name.length > 20
                      ? data?.user?.name.substring(0, 20) + "..."
                      : data?.user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-200">
                    {data?.user?.email.length > 22
                      ? data?.user?.email.substring(0, 22) + "..."
                      : data?.user?.email}
                  </p>
                </div>
              </div>
              {data?.user?.bio ? (
                <p className="text-sm my-4 text-black dark:text-white">
                  {data?.user?.bio.length > 500
                    ? data?.user?.bio.substring(0, 500) + "..."
                    : data?.user?.bio}
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
                    {data?.user?._count?.posts}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    Comments
                  </p>
                  <p className="text-sm text-center text-black dark:text-white">
                    {data?.user?._count?.Comments}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    Likes
                  </p>
                  <p className="text-sm text-center text-black dark:text-white">
                    {data?.user?._count?.Likes}
                  </p>
                </div>
              </div>
              <div className="flex justify-evenly">
                <Link href="/">
                  <button className="mt-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in">
                    Back
                  </button>
                </Link>
              </div>
            </div>
            <div>
              {data?.user?.posts
                .sort((a: any, b: any) => (a.date < b.date ? 1 : -1))
                .map((item: any) => (
                  <div key={item.id}>
                    <Post
                      id={item.id}
                      ownerId={data?.user?.id}
                      ownerEmail={item.email}
                      ownerName={data?.user?.name}
                      ownerImage={data?.user?.image}
                      text={item.text}
                      date={item.date}
                      comments={item.postComments}
                      likesCount={item?._count?.Likes}
                      likesData={item?.Likes}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  else {
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
