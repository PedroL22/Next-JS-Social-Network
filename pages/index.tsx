import React, { FormEvent, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import Post from "../components/Post";
import api from "../lib/axios";

export default function Home({ posts }: any) {
  const { data: session }: any = useSession({ required: true });
  const [newPost, setNewPost] = useState("");

  async function handleCreatePost(event: FormEvent) {
    event.preventDefault();

    await api.post("/api/posts/create", {
      text: newPost,
      email: session.user.email,
    });

    setNewPost("");
  }

  return (
    <div>
      <Head>
        <title>Next JS Social Network</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-200 min-h-screen">
        <main className="pt-20 mx-auto max-w-7xl">
          <div className="flex px-4">
            <form onSubmit={handleCreatePost} className="mx-auto">
              <input
                type="text"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-gray-white pl-4 xl:pr-44 pr-36 pt-4 pb-10 rounded-md outline-0 border focus:border-gray-400"
                placeholder="Write something..."
              />
              <button
                type="submit"
                className="block my-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
              >
                Post
              </button>
            </form>
          </div>
          <div>
            {posts
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
                    commentOwnerName={item.commentOwnerName}
                    commentOwnerImage={item.commentOwnerImage}
                    commentDate={item.commentDate}
                    commentText={item.commentText}
                  />
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.posts.findMany({
    include: {
      User: true,
      comments: {
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

  const postsData: any = posts.map((post: any) => {
    return {
      id: post.id,
      text: post.text,
      date: post.createdAt.toISOString(),
      ownerId: post.User?.id,
      ownerName: post.User?.name,
      ownerImage: post.User?.image,
      ownerEmail: post.email,

      commentOwnerName: post.comments.map((i: any) => {
        return i.User?.name;
      }),
      commentOwnerImage: post.comments.map((i: any) => {
        return i.User?.image;
      }),
      commentDate: post.comments.map((i: any) => {
        return i.createdAt.toISOString();
      }),
      commentText: post.comments.map((i: any) => {
        return i.text;
      }),
    };
  });

  return {
    props: {
      posts: postsData,
    },
  };
};
