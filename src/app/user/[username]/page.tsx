'use client';

import LikedPosts from '@/components/LikedPosts';
import MarkedPosts from '@/components/MarkedPosts';
import UserInfoHeader from '@/components/UserInfoHeader';
import UserPosts from '@/components/UserPosts';
import { getAllUsers, getUserByName } from '@/services/sanity';
import { PostOption } from '@/types/post';
import { useState } from 'react';
import useSWR from 'swr';
import { BsGrid3X3 } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';

const BUTTON_CLASS = ' text-3xl block border-t-3 border-t-zinc-700';
const BUTTON_CONTAINER_CLASS = 'flex items-center text-2xl p-7';

type Props = {
  // params: {
  //   username: string;
  // };
  searchParams: { name: string };
};

export default function UserPage({ searchParams: { name } }: Props) {
  const [selected, setSelected] = useState<PostOption>('posts');
  const { data: allUsers } = useSWR('allUsers', () => getAllUsers());
  const { data: userInfo } = useSWR(`user/${name}`, () =>
    getUserByName(allUsers, name)
  );
  const isPostsClicked = selected === 'posts';
  const isSavedClicked = selected === 'saved';
  const isLikedClicked = selected === 'liked';

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const tagName = target?.tagName;
    if (tagName === 'BUTTON') {
      const name = (target as HTMLButtonElement).name as PostOption;
      setSelected(name);
    }
  };

  return (
    <>
      {userInfo && <UserInfoHeader userInfo={userInfo} />}

      <div onClick={handleClick}>
        <div className="flex justify-center gap-16 ">
          <span
            className={
              isPostsClicked
                ? `${BUTTON_CONTAINER_CLASS} border-t-[3px] border-zinc-400`
                : BUTTON_CONTAINER_CLASS
            }
          >
            <BsGrid3X3 />
            <button
              className={
                isPostsClicked ? `${BUTTON_CLASS} font-semibold` : BUTTON_CLASS
              }
              name="posts"
              data-testid="posts"
            >
              Posts
            </button>
          </span>

          <span
            className={
              isSavedClicked
                ? `${BUTTON_CONTAINER_CLASS} border-t-[3px] border-zinc-400`
                : BUTTON_CONTAINER_CLASS
            }
          >
            <BsBookmark />
            <button
              className={
                isSavedClicked ? `${BUTTON_CLASS} font-semibold` : BUTTON_CLASS
              }
              name="saved"
              data-testid="saved"
            >
              Saved
            </button>
          </span>

          <span
            className={
              isLikedClicked
                ? `${BUTTON_CONTAINER_CLASS} border-t-[3px] border-zinc-400`
                : BUTTON_CONTAINER_CLASS
            }
          >
            <AiOutlineHeart className="text-3xl" />
            <button
              className={
                isLikedClicked ? `${BUTTON_CLASS} font-semibold` : BUTTON_CLASS
              }
              name="liked"
              data-testid="liked"
            >
              Liked
            </button>
          </span>
        </div>
      </div>
      {selected === 'posts' && userInfo?.[0] && (
        <UserPosts postIds={userInfo?.[0].posts} userInfo={userInfo?.[0]} />
      )}
      {selected === 'saved' && userInfo?.[0] && (
        <MarkedPosts postIds={userInfo?.[0].marked} userInfo={userInfo?.[0]} />
      )}
      {selected === 'liked' && userInfo?.[0] && (
        <LikedPosts postIds={userInfo?.[0].liked} userInfo={userInfo?.[0]} />
      )}
    </>
  );
}
