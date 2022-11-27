import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Post from "../components/Post";
import { prisma } from "../lib/prisma";
import { GetServerSideProps } from "next";

export default function Account({ posts }: any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session }: any = useSession({ required: true });

  if (session) {
    return (
      <div>
        <Head>
          <title>{session.user.name} - Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="xl:flex block xl:max-w-7xl xl:mx-auto">
          <div className="xl:pt-36 pt-20 xl:ml-5 xl:flex block">
            <Image
              src={session.user.image}
              alt="user profile picture"
              width={100}
              height={100}
              className="w-36 h-36 xl:mx-0 mx-auto rounded-lg"
            />
            <div>
              <h1 className="xl:ml-10 mt-2 text-center font-medium text-3xl text-gray-600">
                {session.user.name}
              </h1>
              <p className="xl:ml-10 text-center text-gray-400">
                {session.user.email}
              </p>
              <Link href="/">
                <button className="flex mt-2 mx-auto xl:ml-24 text-white bg-blue-700 rounded-md px-5 py-2 hover:bg-blue-800 transition-all ease-in duration-75">
                  Back
                </button>
              </Link>
            </div>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.posts.findMany({
    include: {
      User: true,
      postComments: {
        select: {
          id: true,
          email: true,
          text: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      },
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

      comments: post.comments.map((i: any) => {
        const dia = [
          i.User?.name,
          i.User?.image,
          i.createdAt.toISOString(),
          i.text,
        ];
        return dia;
      }),
    };
  });

  return {
    props: {
      posts: data,
    },
  };
};
