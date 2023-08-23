'use client';

import LikedPosts from '@/components/LikedPosts';
import MarkedPosts from '@/components/MarkedPosts';
import UserInfoHeader from '@/components/UserInfoHeader';
import UserPosts from '@/components/UserPosts';
import {
  followUser,
  getAllUsers,
  getAllUsersWithFollowingInfo,
  getUserByName,
  unfollowUser,
} from '@/services/sanity';
import { PostOption } from '@/types/post';
import { useState } from 'react';
import useSWR from 'swr';
import { BsGrid3X3 } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import { useSession } from 'next-auth/react';

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
  const [isLoading, setIsLoading] = useState(false);
  // const { data: allUsers } = useSWR('allUsers', () => gåetAllUsers());
  const { data: session } = useSession();
  const { data: allUsersWithFollowingInfo } = useSWR(
    `allUsersWithFollowingInfo/${session?.user?.name}`,
    () => getAllUsersWithFollowingInfo(session)
  );
  const { data: userInfo } = useSWR(`user/${name}`, () =>
    getUserByName(allUsersWithFollowingInfo, name)
  );
  const { data: myInfo } = useSWR(`user/${session?.user?.name}`, () =>
    getUserByName(allUsersWithFollowingInfo, session?.user?.name)
  );
  const isMe = session?.user?.name === userInfo?.[0]?.name;
  const isPostsClicked = selected === 'posts';
  const isSavedClicked = selected === 'saved';
  const isLikedClicked = selected === 'liked';

  const handlePostTypeClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const tagName = target?.tagName;
    if (tagName === 'BUTTON') {
      const name = (target as HTMLButtonElement).name as PostOption;
      setSelected(name);
    }
  };

  const handleFollowingOrUnfollowingClick = (e: React.MouseEvent) => {
    if (!(userInfo?.[0] && myInfo?.[0])) {
      return;
    }

    const target = e.target as HTMLButtonElement;
    const targetName = target.name;
    if (targetName === 'follow') {
      setIsLoading(true);
      followUser(userInfo?.[0], myInfo[0]).then(() => setIsLoading(false));
      return;
    }
    setIsLoading(true);
    unfollowUser(userInfo?.[0], myInfo[0]).then(() => setIsLoading(false));
  };

  return (
    <>
      {userInfo && (
        <UserInfoHeader
          userInfo={userInfo}
          isMe={isMe}
          isFollowing={userInfo[0]?.isFollowing}
          isLoading={isLoading}
          onClick={handleFollowingOrUnfollowingClick}
        />
      )}

      <div onClick={handlePostTypeClick}>
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
