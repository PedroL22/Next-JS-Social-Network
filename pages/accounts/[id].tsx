import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import api from '../../lib/axios'
import Post from '../../components/Post'

export const getServerSideProps = async (context: any) => {
  const id = context.params.id
  const fetch = await api.get('/api/users/' + id)
  const res = await fetch.data

  return {
    props: {
      data: res,
    },
  }
}

export default function Details({ data }: any) {
  const { data: session } = useSession()

  return (
    <div className='min-h-screen bg-gray-200 dark:bg-gray-800'>
      <Head>
        <title>
          {data?.user?.name.length > 25
            ? data?.user?.name.substring(0, 25) + '... '
            : data?.user?.name}{' '}
          - Next JS Social Network
        </title>
        <meta
          name='description'
          content={`${data?.user?.name} - Next JS Social Network`}
        />
        <link
          rel='icon'
          href='/favicon.png'
        />
      </Head>

      <div className='block md:mx-auto md:flex md:max-w-7xl md:justify-around xl:mx-auto xl:flex xl:max-w-7xl xl:justify-around'>
        <div className='pt-16 md:flex xl:flex'>
          <div className='mx-auto mt-4 h-fit max-w-xs rounded-xl bg-white p-10 shadow dark:bg-gray-700'>
            <div className='flex'>
              {data?.user?.image && (
                <Image
                  src={data?.user?.image}
                  alt={data?.user?.name + ' profile picture'}
                  className='mr-2 cursor-pointer rounded-full'
                  width={65}
                  height={65}
                />
              )}

              <div className='mt-3'>
                <p className='whitespace-nowrap font-medium text-black dark:text-white'>
                  {data?.user?.name.length > 18
                    ? data?.user?.name.substring(0, 18) + '...'
                    : data?.user?.name}
                </p>
                <p className='whitespace-nowrap text-sm text-gray-500 dark:text-gray-200'>
                  {data?.user?.email.length > 22
                    ? data?.user?.email.substring(0, 22) + '...'
                    : data?.user?.email}
                </p>
              </div>
            </div>
            {data?.user?.bio ? (
              <p className='my-4 text-sm text-black dark:text-white'>
                {data?.user?.bio.length > 500
                  ? data?.user?.bio.substring(0, 500) + '...'
                  : data?.user?.bio}
              </p>
            ) : (
              <p className='my-4 text-sm text-black dark:text-white'>
                No biography yet.
              </p>
            )}
            <div className='flex justify-around gap-10'>
              <div>
                <p className='text-sm font-medium text-black dark:text-white'>
                  Posts
                </p>
                <p className='text-center text-sm text-black dark:text-white'>
                  {data?.user?._count?.posts}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-black dark:text-white'>
                  Comments
                </p>
                <p className='text-center text-sm text-black dark:text-white'>
                  {data?.user?._count?.Comments}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-black dark:text-white'>
                  Likes
                </p>
                <p className='text-center text-sm text-black dark:text-white'>
                  {data?.user?._count?.Likes}
                </p>
              </div>
            </div>
            <div className='flex justify-evenly'>
              <Link href='/'>
                <button className='duration-250 mt-4 rounded-md bg-blue-700 px-5 py-2 text-white transition-all ease-in hover:bg-blue-800 active:bg-blue-900'>
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
  )
}
