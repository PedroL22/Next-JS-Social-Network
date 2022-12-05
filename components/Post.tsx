import React, { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import api from "../lib/axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

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
  const { data: session }: any = useSession({ required: true });
  const postDate = moment(date).format("MMMM Do YYYY, h:mm a");
  const [postText, setPostText] = useState("");
  const [commentTextState, setCommentTextState] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const notify = (notif: string) => toast.success(notif);
  const notifyError = (notif: string) => toast.error(notif);

  async function handleEditPost(event: FormEvent) {
    event.preventDefault();

    try {
      postText !== ""
        ? await api.post("/api/posts/edit", {
            text: postText,
            id: id,
          })
        : notifyError("Post can't be empty.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditingPost(false);
      postText !== "" ? notify("Post edited successfully.") : null;
      refreshData();
    }
  }

  async function handleDeletePost() {
    try {
      await api.post("/api/posts/delete", {
        id: id,
      });

      setIsEditingPost(false);
    } catch (e) {
      console.error(e);
    } finally {
      notify("Post deleted successfully.");
      refreshData();
    }
  }

  async function handleCreateComment(event: FormEvent) {
    event.preventDefault();

    try {
      commentTextState !== ""
        ? await api.post("/api/comments/create", {
            postsId: id,
            text: commentTextState,
            email: session?.user?.email,
          })
        : notifyError("Comment can't be empty.");
    } catch (e) {
      console.error(e);
    } finally {
      setCommentTextState("");
      setIsCommenting(false);
      commentTextState !== "" ? notify("Comment posted successfully.") : null;
      refreshData();
    }
  }

  async function handleCreateLike() {
    try {
      await api.post("/api/likes/create", {
        postsId: id,
        userId: session?.user?.email,
      });
    } catch (e) {
      console.error(e);
    } finally {
      refreshData();
    }
  }

  async function handleDeletePostLike(event: any, id: any) {
    const code = id.map((i: any) => i.id);

    try {
      await api.post("/api/likes/postDelete", {
        id: code[0],
      });
    } catch (e) {
      console.error(e);
    } finally {
      refreshData();
    }
  }

  return (
    <div className="flex px-4">
      <div className="mx-auto bg-white h-auto w-96 my-4 rounded-sm shadow-md p-5">
        <div className="justify-between">
          <div className="flex">
            <Image
              src={ownerImage}
              width={48}
              height={48}
              className="rounded-full cursor-pointer"
              alt={ownerName + "profile picture"}
              onClick={() => router.push("accounts/" + ownerId)}
            />
            <div>
              <Link href={"accounts/" + ownerId}>
                <h2 className="ml-3 font-medium">{ownerName}</h2>
              </Link>
              <p className="ml-3 text-gray-500 whitespace-nowrap">{postDate}</p>
            </div>
            {ownerEmail === session?.user?.email ? (
              <div className="flex -ml-6">
                <MdModeEditOutline
                  className="xl:ml-10 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={() => setIsEditingPost(true)}
                />
                <BsFillTrashFill
                  className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={handleDeletePost}
                />
              </div>
            ) : session?.user?.isAdmin === true ? (
              <div className="flex -ml-6">
                <MdModeEditOutline
                  className="xl:ml-10 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={() => setIsEditingPost(true)}
                />
                <BsFillTrashFill
                  className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                  onClick={handleDeletePost}
                />
              </div>
            ) : null}
          </div>
        </div>

        {isEditingPost === false ? (
          <h1 className="my-5">{text}</h1>
        ) : (
          <form onSubmit={handleEditPost} className="mx-auto">
            <input
              type="text"
              value={postText}
              onChange={(e: any) => setPostText(e.target.value)}
              className="bg-gray-white pl-4 xl:pr-44 pr-36 pt-4 pb-10 rounded-md outline-0 border focus:border-gray-400"
              placeholder="Write something..."
              defaultValue={text}
            />

            <div className="flex">
              <button
                type="submit"
                className="block my-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
              >
                Edit
              </button>
              <button
                onClick={() => setIsEditingPost(false)}
                className="block my-2 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white px-5 py-2 ml-2 rounded-md transition-all duration-250 ease-in"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="flex justify-around">
          {likesData
            .map((i: any) => i.userId)
            .includes(session?.user?.email) ? (
            <div
              onClick={(event) => handleDeletePostLike(event, likesData)}
              className="flex bg-blue-500 w-full px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-250 ease-in"
            >
              <AiFillLike className="text-white" />
              {likesCount >= 2 ? (
                <div className="flex">
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    {likesCount}
                  </p>
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    Likes
                  </p>
                </div>
              ) : likesCount === 1 ? (
                <div className="flex">
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    {likesCount}
                  </p>
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    Like
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    Like
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={handleCreateLike}
              className="flex bg-gray-200 w-full px-3 py-2 rounded-md hover:bg-gray-300 cursor-pointer transition-all duration-250 ease-in"
            >
              <AiFillLike />

              {likesCount >= 2 ? (
                <div className="flex">
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    {likesCount}
                  </p>
                  <p className="font-medium -mt-1 ml-1 text-white hover:text-gray-300 transition-all duration-250 ease-in">
                    Likes
                  </p>
                </div>
              ) : likesCount === 1 ? (
                <div className="flex">
                  <p className="font-medium -mt-1 ml-1">{likesCount}</p>
                  <p className="font-medium -mt-1 ml-1">Like</p>
                </div>
              ) : (
                <div className="flex">
                  <p className="font-medium -mt-1 ml-1">Like</p>
                </div>
              )}
            </div>
          )}
          {isCommenting === false ? (
            <div
              onClick={() => setIsCommenting(true)}
              className="flex bg-gray-200 w-full px-3 py-2 rounded-md hover:bg-gray-300 cursor-pointer transition-all duration-250 ease-in"
            >
              <BiCommentDetail />
              <p className="font-medium -mt-1 ml-1">Comment</p>
            </div>
          ) : (
            <div
              onClick={() => setIsCommenting(false)}
              className="flex bg-gray-200 w-full px-3 py-2 rounded-md hover:bg-gray-300 cursor-pointer transition-all duration-250 ease-in"
            >
              <BiCommentDetail />
              <p className="font-medium -mt-1 ml-1">Comment</p>
            </div>
          )}
        </div>
        {isCommenting === true ? (
          <form onSubmit={handleCreateComment} className="flex mx-auto">
            <input
              type="text"
              value={commentTextState}
              onChange={(e: any) => setCommentTextState(e.target.value)}
              className="bg-gray-white pl-4 xl:pr-24 pr-12 pt-4 pb-10 rounded-md outline-0 border focus:border-gray-400"
              placeholder="Comment something..."
            />
            <button
              type="submit"
              className="my-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
            >
              <IoMdSend className="text-gray-white hover:text-gray-200 transition-all duration-250 ease-in" />
            </button>
          </form>
        ) : null}
        <div>
          {comments.map((comment: any) => {
            async function handleDeleteComment() {
              await api.post("/api/comments/delete", {
                id: comment.id,
              });

              notify("Comment deleted successfully.");

              setIsEditingPost(false);
            }

            return (
              <div key={comment.id} className="my-6">
                <div className="flex">
                  <div className="flex justify-between">
                    <Image
                      src={comment?.User?.image}
                      width={40}
                      height={40}
                      className="w-[40px] h-[40px] rounded-full cursor-pointer"
                      alt={comment?.User?.name + "profile picture"}
                      onClick={() =>
                        router.push("accounts/" + comment?.User?.id)
                      }
                    />
                    <div>
                      <h4
                        className="ml-3 font-medium cursor-pointer w-56"
                        onClick={() =>
                          router.push("accounts/" + comment?.User?.id)
                        }
                      >
                        {comment?.User?.name}
                      </h4>
                      <p className="ml-3 text-gray-500 whitespace-nowrap">
                        {moment(comment?.createdAt?.toString()).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </p>
                    </div>
                    {comment.email === session?.user?.email ? (
                      <div className="flex xl:ml-10">
                        <BsFillTrashFill
                          className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                          onClick={handleDeleteComment}
                        />
                      </div>
                    ) : session?.user?.isAdmin === true ? (
                      <div className="flex xl:ml-10">
                        <BsFillTrashFill
                          className="ml-2 mr-2 cursor-pointer text-gray-400 hover:text-gray-500 transition-all duration-250 ease-in"
                          onClick={handleDeleteComment}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <h3>{comment.text}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
