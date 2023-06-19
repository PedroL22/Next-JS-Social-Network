import React, { FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import { MdModeEditOutline } from 'react-icons/md'
import { BsFillTrashFill } from 'react-icons/bs'
import { IoMdSend } from 'react-icons/io'
import { AiFillLike } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import api from '../lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

export default function Post({
  id,
  text,
  date,
  ownerId,
  ownerName,
  ownerImage,
  ownerEmail,
  comments,
  likesCount,
  likesData,
}: any) {
  const { data: session }: any = useSession()
  const postDate = moment(date).format('MMMM Do YYYY, h:mm a')
  const [postText, setPostText] = useState('')
  const [commentTextState, setCommentTextState] = useState('')
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const notify = (notif: string) => toast.success(notif)
  const notifyError = (notif: string) => toast.error(notif)

  async function handleEditPost(event: FormEvent) {
    event.preventDefault()

    try {
      postText !== ''
        ? await api.post('/api/posts/edit', {
            text: postText,
            id: id,
          })
        : notifyError("Post can't be empty.")
    } catch (e) {
      console.error(e)
    } finally {
      setIsEditingPost(false)
      postText !== '' ? notify('Post edited successfully.') : null
      refreshData()
    }
  }

  async function handleDeletePost() {
    try {
      await api.post('/api/posts/delete', {
        id: id,
      })

      setIsEditingPost(false)
    } catch (e) {
      console.error(e)
    } finally {
      notify('Post deleted successfully.')
      refreshData()
    }
  }

  async function handleCreateComment(event: FormEvent) {
    event.preventDefault()

    try {
      commentTextState !== ''
        ? await api.post('/api/comments/create', {
            postsId: id,
            text: commentTextState,
            email: session?.user?.email,
          })
        : notifyError("Comment can't be empty.")
    } catch (e) {
      console.error(e)
    } finally {
      setCommentTextState('')
      setIsCommenting(false)
      commentTextState !== '' ? notify('Comment posted successfully.') : null
      refreshData()
    }
  }

  async function handleCreateLike() {
    try {
      session
        ? await api.post('/api/likes/create', {
            postsId: id,
            userId: session?.user?.email,
          })
        : null
    } catch (e) {
      console.error(e)
    } finally {
      refreshData()
    }
  }

  async function handleDeletePostLike(event: any, id: any) {
    const code = id.map((i: any) => i.id)

    try {
      await api.post('/api/likes/postDelete', {
        id: code[0],
      })
    } catch (e) {
      console.error(e)
    } finally {
      refreshData()
    }
  }

  return (
    <div className='flex px-4'>
      <div className='mx-auto my-4 h-auto w-80 rounded-md bg-white p-5 shadow-md dark:bg-gray-700'>
        <div className='justify-between'>
          <div className='flex'>
            <Image
              src={ownerImage}
              width={48}
              height={48}
              className='cursor-pointer rounded-full'
              alt={ownerName + 'profile picture'}
              onClick={() => router.push('accounts/' + ownerId)}
            />
            <div>
              <Link href={'accounts/' + ownerId}>
                <h2 className='ml-3 font-medium text-black dark:text-white'>
                  {ownerName.length > 16
                    ? ownerName.substring(0, 16) + '...'
                    : ownerName}
                </h2>
              </Link>
              <p className='ml-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200'>
                {postDate}
              </p>
            </div>
            {ownerEmail === session?.user?.email ? (
              <div className='-ml-6 flex'>
                <MdModeEditOutline
                  className='duration-250 cursor-pointer text-gray-400 transition-all ease-in hover:text-gray-500'
                  onClick={() => setIsEditingPost(true)}
                />
                <BsFillTrashFill
                  className='duration-250 ml-2 mr-2 cursor-pointer text-gray-400 transition-all ease-in hover:text-gray-500'
                  onClick={handleDeletePost}
                />
              </div>
            ) : session?.user?.isAdmin === true ? (
              <div className='-ml-6 flex'>
                <MdModeEditOutline
                  className='duration-250 cursor-pointer text-gray-400 transition-all ease-in hover:text-gray-500'
                  onClick={() => setIsEditingPost(true)}
                />
                <BsFillTrashFill
                  className='duration-250 ml-2 mr-2 cursor-pointer text-gray-400 transition-all ease-in hover:text-gray-500'
                  onClick={handleDeletePost}
                />
              </div>
            ) : null}
          </div>
        </div>

        {isEditingPost === false ? (
          <h1 className='my-5 text-black dark:text-white'>
            {text.length > 750 ? text.substring(0, 750) + '...' : text}
          </h1>
        ) : (
          <form
            onSubmit={handleEditPost}
            className='mx-auto'
          >
            <input
              type='text'
              value={postText}
              onChange={(e: any) => setPostText(e.target.value)}
              className='rounded-md border bg-white pb-10 pl-4 pr-36 pt-4 outline-0 focus:border-gray-400 xl:pr-44'
              placeholder='Write something...'
              defaultValue={text}
            />

            <div className='flex'>
              <button
                type='submit'
                className='duration-250 my-2 block rounded-md bg-blue-700 px-5 py-2 text-white transition-all ease-in hover:bg-blue-800 active:bg-blue-900'
              >
                Edit
              </button>
              <button
                onClick={() => setIsEditingPost(false)}
                className='duration-250 my-2 ml-2 block rounded-md bg-red-700 px-5 py-2 text-white transition-all ease-in hover:bg-red-800 active:bg-red-900'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className='flex justify-around gap-5'>
          {likesData
            .map((i: any) => i.userId)
            .includes(session?.user?.email) ? (
            <div
              onClick={(event) => handleDeletePostLike(event, likesData)}
              className='duration-250 flex w-full cursor-pointer rounded-md bg-blue-500 px-3 py-2 transition-all ease-in hover:bg-blue-600'
            >
              <AiFillLike className='text-white' />
              {likesCount >= 2 ? (
                <div className='flex'>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-white transition-all ease-in hover:text-gray-300'>
                    {likesCount}
                  </p>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-white transition-all ease-in hover:text-gray-300'>
                    Likes
                  </p>
                </div>
              ) : likesCount === 1 ? (
                <div className='flex'>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-white transition-all ease-in hover:text-gray-300'>
                    {likesCount}
                  </p>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-white transition-all ease-in hover:text-gray-300'>
                    Like
                  </p>
                </div>
              ) : (
                <div className='flex'>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-white transition-all ease-in hover:text-gray-300'>
                    Like
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={handleCreateLike}
              className='duration-250 flex w-full cursor-pointer rounded-md bg-gray-200 px-3 py-2 transition-all ease-in hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600'
            >
              <AiFillLike className='text-black dark:text-white' />

              {likesCount >= 2 ? (
                <div className='flex'>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-black transition-all ease-in hover:text-gray-300 dark:text-white'>
                    {likesCount}
                  </p>
                  <p className='duration-250 -mt-1 ml-1 font-medium text-black transition-all ease-in hover:text-gray-300 dark:text-white'>
                    Likes
                  </p>
                </div>
              ) : likesCount === 1 ? (
                <div className='flex'>
                  <p className='-mt-1 ml-1 font-medium dark:text-white'>
                    {likesCount}
                  </p>
                  <p className='-mt-1 ml-1 font-medium dark:text-white'>Like</p>
                </div>
              ) : (
                <div className='flex'>
                  <p className='-mt-1 ml-1 font-medium dark:text-white'>Like</p>
                </div>
              )}
            </div>
          )}
          {isCommenting === false && session ? (
            <div
              onClick={() => setIsCommenting(true)}
              className='duration-250 flex w-full cursor-pointer rounded-md bg-gray-200 px-3 py-2 transition-all ease-in hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600'
            >
              <BiCommentDetail className='text-black dark:text-white' />
              <p className='-mt-1 ml-1 font-medium text-black dark:text-white'>
                Comment
              </p>
            </div>
          ) : (
            <div
              onClick={() => setIsCommenting(false)}
              className='duration-250 flex w-full cursor-pointer rounded-md bg-gray-200 px-3 py-2 transition-all ease-in hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600'
            >
              <BiCommentDetail className='text-black dark:text-white' />
              <p className='-mt-1 ml-1 font-medium text-black dark:text-white'>
                Comment
              </p>
            </div>
          )}
        </div>
        {isCommenting === true ? (
          <form
            onSubmit={handleCreateComment}
            className='mx-auto mt-5 flex'
          >
            <input
              type='text'
              value={commentTextState}
              onChange={(e: any) => setCommentTextState(e.target.value)}
              className='w-full rounded-md border bg-gray-200 pl-4 outline-none focus:border-gray-400 dark:border-none dark:bg-gray-600 dark:text-white'
              placeholder='Comment something...'
            />
            <button
              type='submit'
              className='duration-250 ml-2 rounded-md bg-blue-700 px-5 py-3 text-white transition-all ease-in hover:bg-blue-800 active:bg-blue-900'
            >
              <IoMdSend className='duration-250 text-white transition-all ease-in hover:text-gray-200' />
            </button>
          </form>
        ) : null}
        <div>
          {comments.map((comment: any) => {
            async function handleDeleteComment() {
              await api.post('/api/comments/delete', {
                id: comment.id,
              })

              notify('Comment deleted successfully.')

              setIsEditingPost(false)
            }

            return (
              <div
                key={comment.id}
                className='my-6'
              >
                <div className='flex'>
                  <div className='flex justify-between'>
                    <Image
                      src={comment?.User?.image}
                      width={40}
                      height={40}
                      className='h-[40px] w-[40px] cursor-pointer rounded-full'
                      alt={comment?.User?.name + 'profile picture'}
                      onClick={() =>
                        router.push('accounts/' + comment?.User?.id)
                      }
                    />
                    <div>
                      <h4
                        className='ml-3 w-56 cursor-pointer font-medium text-black dark:text-white'
                        onClick={() =>
                          router.push('accounts/' + comment?.User?.id)
                        }
                      >
                        {comment?.User?.name.length > 16
                          ? comment?.User?.name.substring(0, 16) + '...'
                          : comment?.User?.name}
                      </h4>
                      <p className='ml-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200'>
                        {moment(comment?.createdAt?.toString()).format(
                          'MMMM Do YYYY, h:mm a'
                        )}
                      </p>
                    </div>
                    {comment.email === session?.user?.email ? (
                      <div className='flex'>
                        <BsFillTrashFill
                          className='duration-250 -ml-3 cursor-pointer text-gray-400 transition-all ease-in hover:text-gray-500'
                          onClick={handleDeleteComment}
                        />
                      </div>
                    ) : session?.user?.isAdmin === true ? (
                      <div className='flex'>
                        <BsFillTrashFill
                          className='duration-250 -ml-3 cursor-pointer text-gray-400 transition-all ease-in hover:text-gray-500'
                          onClick={handleDeleteComment}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <h3 className='text-black dark:text-white'>
                  {comment.text.length > 750
                    ? comment.text.substring(0, 750) + '...'
                    : comment.text}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
