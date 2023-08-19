import Image from 'next/image';
import Avatar from './Avatar';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import { ChangeEvent, useRef, useState } from 'react';
import {
  addCommentToPost,
  addPostIdToUSerInfo,
  removePostIdFromUserInfo,
} from '@/services/sanity';
import { format } from 'timeago.js';
import { v4 as uuidv4 } from 'uuid';
import { Comment, Post } from '@/types/post';

type Props = {
  post: Post;
  index: number;
  onUpdated: (index: number, updated: Post) => void;
};
export default function PostCard({ post, index, onUpdated }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [comment, setComment] = useState('');
  const {
    _id: postId,
    avatarUrl,
    imgUrl,
    name: username,
    comments,
    _createdAt,
    isLiked,
    likes,
    isMarked,
  } = post;

  const handlePostClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'DIALOG') {
      dialogRef?.current?.close();
      return;
    }

    dialogRef?.current?.showModal();
  };

  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setComment(target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newComment = {
      comment,
      username,
      _key: uuidv4(),
    };

    addCommentToPost(newComment, postId, () =>
      onUpdated(index, {
        ...post,
        comments: [...post.comments, newComment],
      })
    );
    setComment('');
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget as HTMLButtonElement;
    if (currentTarget.name === 'marked') {
      !isMarked &&
        addPostIdToUSerInfo(post, 'marked', () =>
          onUpdated(index, { ...post, isMarked: true })
        );
      isMarked &&
        removePostIdFromUserInfo(post, 'marked', () =>
          onUpdated(index, { ...post, isMarked: false })
        );
      return;
    }

    if (currentTarget.name === 'liked') {
      !isLiked &&
        addPostIdToUSerInfo(post, 'liked', () =>
          onUpdated(index, { ...post, isLiked: true, likes: post.likes + 1 })
        );
      isLiked &&
        removePostIdFromUserInfo(post, 'liked', () =>
          onUpdated(index, {
            ...post,
            isLiked: false,
            likes: post.likes === 0 ? post.likes : post.likes - 1,
          })
        );
    }
  };
  return (
    <>
      <form className="shadow-lg my-4 rounded-lg" onSubmit={handleSubmit}>
        <div className="flex items-center p-2 rounded-md">
          <Avatar src={avatarUrl} width={70} />
          <p className="text-xl font-bold ml-2">{username}</p>
        </div>
        <Image
          className="w-full h-full "
          src={imgUrl}
          data-testid="postImage"
          alt="postImg"
          width={300}
          height={500}
          onClick={handlePostClick}
        />

        <div className="p-4 px-3">
          <div className="flex justify-between">
            <button
              className="text-5xl "
              type="button"
              name="liked"
              data-testid="likeButton"
              onClick={handleClick}
            >
              {isLiked ? (
                <AiFillHeart className="text-red-500" />
              ) : (
                <AiOutlineHeart />
              )}
            </button>

            <button
              className="text-4xl "
              type="button"
              name="marked"
              data-testid="markButton"
              onClick={handleClick}
            >
              {isMarked ? (
                <BsBookmarkFill className="text-black opacity-7" />
              ) : (
                <BsBookmark />
              )}
            </button>
          </div>
          <p className="text-lg font-bold ml-1 mb-2">{likes} like</p>
          {comments?.length === 1 && (
            <li className="text-2xl flex gap-2">
              <p className="font-bold">{(comments as Comment[])[0].username}</p>
              <p className="font-normal">
                {(comments as Comment[])[0].comment}
              </p>
            </li>
          )}
          {comments?.length > 1 && (
            <button
              className="text-2xl font-bold text-sky-700"
              onClick={handlePostClick}
              type="button"
            >{`View all ${comments.length} comments`}</button>
          )}
          <p className="text-xl text-zinc-500 mt-2">{format(_createdAt)}</p>
        </div>
        <div className="flex items-center text-3xl border border-t-[3px]  p-3">
          <div className="flex flex-col justify-center items-center ">
            <FaRegSmile />
          </div>
          <input
            className="p-1 px-2 ml-3 flex-grow outline-none text-2xl"
            type="text"
            data-testid="commentInput"
            value={comment}
            onChange={handleChange}
            placeholder="Add a comments..."
          />
          <button
            className="text-sky-500 font-bold text-2xl p-2 disabled:text-sky-300"
            type="submit"
            data-testid="submitButton"
            disabled={comment === ''}
          >
            Post
          </button>
        </div>
      </form>
      {/* dailog */}
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black backdrop:opacity-70 w-3/5 max-w-screen-2xl "
        onClick={handlePostClick}
        data-testid="modal"
      >
        <form className="flex shadow-lg  rounded-lg" onSubmit={handleSubmit}>
          <section
            className="basis-7/12 flex-grow"
            style={{
              height: `${900}px`,
            }}
          >
            <Image
              className="w-full h-full"
              src={imgUrl}
              alt="postImg"
              width={100}
              height={100}
            />
          </section>

          <section className="basis-5/12 flex flex-col">
            <div className="flex items-center p-2 rounded-md border border-b-[3px] ">
              <Avatar src={avatarUrl} width={60} />
              <p className="text-xl font-bold ml-2">{username}</p>
            </div>
            <ul className="p-5 flex-grow">
              {comments?.length &&
                comments.map(({ comment, username }: Comment) => (
                  <li key={uuidv4()} className="text-xl flex gap-2">
                    <Avatar src={avatarUrl} width={40} />
                    <h1 className="font-bold">{username}</h1>
                    <p className="font-normal">{comment}</p>
                  </li>
                ))}
            </ul>
            <div className="p-4 px-3">
              <div className="flex justify-between">
                <button
                  className="text-5xl "
                  type="button"
                  name="liked"
                  data-testid="likeButtonModal"
                  onClick={handleClick}
                >
                  {isLiked ? (
                    <AiFillHeart className="text-red-500" />
                  ) : (
                    <AiOutlineHeart />
                  )}
                </button>

                <button
                  className="text-4xl "
                  type="button"
                  name="marked"
                  data-testid="markButtonModal"
                  onClick={handleClick}
                >
                  {isMarked ? (
                    <BsBookmarkFill className="text-black opacity-7" />
                  ) : (
                    <BsBookmark />
                  )}
                </button>
              </div>
              <p className="text-lg font-bold ml-1 mb-2">{likes} like</p>

              <p className="text-xl text-zinc-500 mt-2">{format(_createdAt)}</p>
            </div>
            <div className="flex items-center text-3xl border border-t-[3px]  p-3">
              <div className="flex flex-col justify-center items-center ">
                <FaRegSmile />
              </div>
              <input
                className="p-1 px-2 ml-3 flex-grow outline-none text-2xl"
                type="text"
                value={comment}
                data-testid="commentInputModal"
                onChange={handleChange}
                placeholder="Add a comments..."
              />
              <button
                className="text-sky-500 font-bold text-2xl p-2 disabled:text-sky-300"
                type="submit"
                data-testid="submitButtonModal"
                disabled={comment === ''}
              >
                Post
              </button>
            </div>
          </section>
        </form>
      </dialog>
    </>
  );
}
