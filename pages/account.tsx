import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
// import Post from "../components/Post";
import { prisma } from "../lib/prisma";
import { GetServerSideProps } from "next";
import Post from "../components/Post";

export default function Account({ posts, aside }: any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session }: any = useSession({ required: true });

  if (session) {
    return (
      <div className="bg-gray-200 min-h-screen">
        <Head>
          <title>{session.user.name} - Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="md:flex md:max-w-7xl md:mx-auto md:justify-around xl:flex xl:max-w-7xl xl:mx-auto xl:justify-around block ">
          <div className="md:flex xl:flex pt-20">
            <div className="bg-white max-w-xs p-10 rounded-xl shadow mx-auto md:mt-4 xl:mt-4 h-fit">
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
                  <p className="font-medium">{session?.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              {aside.bio ? (
                <p className="text-sm my-4">{aside.bio}</p>
              ) : (
                <p className="text-sm my-4">No biography yet.</p>
              )}
              <div className="flex justify-around gap-10">
                <div>
                  <p className="text-sm font-medium">Posts</p>
                  <p className="text-sm text-center">{aside._count.posts}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Comments</p>
                  <p className="text-sm text-center">{aside._count.Comments}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Likes</p>
                  <p className="text-sm text-center">{aside._count.Likes}</p>
                </div>
              </div>
            </div>
            <div className="">
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

  const aside = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    select: {
      bio: true,
      _count: {
        select: { posts: true, Comments: true, Likes: true },
      },
    },
  });

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
