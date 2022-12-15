import React, { FormEvent, useState } from "react";
import Head from "next/head";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import Post from "../components/Post";
import api from "../lib/axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ProfileAside from "../components/ProfileAside";

export default function Home({ posts, aside }: any) {
  const { data: session }: any = useSession({ required: false });
  const [newPost, setNewPost] = useState("");

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const notify = (notif: string) => toast.success(notif);
  const notifyError = (notif: string) => toast.error(notif);

  async function handleCreatePost(event: FormEvent) {
    event.preventDefault();

    try {
      newPost !== ""
        ? await api.post("/api/posts/create", {
            text: newPost,
            email: session.user.email,
          })
        : notifyError("Post can't be empty.");
    } catch (e) {
      console.error(e);
    } finally {
      setNewPost("");
      newPost !== "" ? notify("Successfully posted.") : null;
      refreshData();
    }
  }

  return (
    <div>
      <Head>
        <title>Next JS Social Network</title>
        <meta
          name="description"
          content="A Next JS social network prototype built with Tailwind CSS, Daisy UI and Prisma."
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="bg-gray-200 dark:bg-gray-800 min-h-screen flex">
        <main className="pt-20 mx-auto max-w-7xl">
          <div className="flex md:gap-80 lg:gap-96 xl:gap-96 md:justify-around lg:justify-around xl:justify-around">
            <div className="hidden md:flex lg:flex xl:flex">
              {session ? (
                <ProfileAside
                  postsCount={aside?._count.posts}
                  commentsCount={aside?._count.Comments}
                  likesCount={aside?._count.Likes}
                  bio={aside?.bio}
                />
              ) : (
                <ProfileAside
                  postsCount={0}
                  commentsCount={0}
                  likesCount={0}
                  bio={"You don't have an account yet."}
                />
              )}
            </div>
            <div>
              <div className="flex px-4">
                {session ? (
                  <form onSubmit={handleCreatePost} className="mx-auto">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white dark:bg-gray-700 dark:text-white h-[15vh] xl:h-32 w-80 mx-auto py-2 px-3 rounded-xl outline-none border dark:border-none focus:border-gray-400 resize-none"
                      placeholder="Post something..."
                    />
                    <button
                      type="submit"
                      className="block my-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
                    >
                      Post
                    </button>
                  </form>
                ) : (
                  <form className="mx-auto">
                    <textarea
                      className="bg-white dark:bg-gray-700 dark:text-white h-[15vh] xl:h-32 w-80 mx-auto py-2 px-3 rounded-xl outline-none border dark:border-none focus:border-gray-400 resize-none"
                      placeholder="You need to login first"
                    />
                    <button
                      type="button"
                      className="block my-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
                    >
                      Post
                    </button>
                  </form>
                )}
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
                        comments={item.comments}
                        likesCount={item.likesCount}
                        likesData={item.likesData}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
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

  const postsData: any = posts.map((post: any) => {
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
      posts: JSON.parse(JSON.stringify(postsData)),
      aside: aside,
    },
  };
};
