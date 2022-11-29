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
      <div className="bg-gray-200 min-h-screen h-full">
        <Head>
          <title>{data?.user?.name} - Next JS Social Network</title>
          <meta
            name="description"
            content="A news website made with The Guardian API, Next JS, and Tailwind CSS based on Globo's G1."
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="xl:flex block xl:max-w-7xl xl:mx-auto ">
          <div className="xl:pt-36 pt-20 xl:ml-5 xl:flex block">
            {data?.user?.image ? (
              <Image
                src={data?.user?.image}
                width={100}
                height={100}
                alt={`${data?.user?.name} profile picture`}
                className="w-36 h-36 xl:mx-0 mx-auto rounded-lg"
              />
            ) : null}
            <div>
              <h1 className="xl:ml-10 mt-2 text-center font-medium text-3xl text-gray-600">
                {data?.user?.name}
              </h1>
              <p className="xl:ml-10 text-center text-gray-400">
                {data?.user?.email}
              </p>
              <Link href="/">
                <button className="flex mt-2 mx-auto xl:ml-24 text-white bg-blue-700 rounded-md px-5 py-2 hover:bg-blue-800 transition-all ease-in duration-75">
                  Back
                </button>
              </Link>
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
                      comments={item.postComments.map((i: any) => {
                        const dia = [
                          i.User?.name,
                          i.User?.image,
                          i.createdAt,
                          i.text,
                        ];
                        return dia;
                      })}
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
