'use client';
import { Session } from 'next-auth';
import Avatar from './Avatar';
import { User } from '@/types/user';
import { PulseLoader } from 'react-spinners';

const COUNT_CLASS = 'font-bold mr-1 text-2xl';
const ENTITY_CLASS = 'text-2xl';
const ENTITY_OUTER_CONTAINER_CLASS = 'flex my-2 gap-3 gap-y-5 items-between';
const ENTITY_INNER_CONTAINER_CLASS = 'flex items-center my-2';
const BUTTON_CLASS =
  'p-3 px-12 -mt-5 rounded-lg opacity-90 disabled:opacity-70';

type Props = {
  userInfo: (User | undefined)[];
  isFollowing: boolean | undefined;
  isLoading: boolean;
  isMe: boolean;
  onClick: (e: React.MouseEvent) => void;
};

export default function UserInfoHeader({
  userInfo,
  isFollowing,
  isLoading,
  isMe,
  onClick,
}: Props) {
  const emailName = userInfo?.[0]?.emailName;
  const emailNamePart = emailName ? emailName.split('@')[0] : '';

  return (
    <div>
      {
        <section className="flex justify-center items-center gap-6 p-1 py-10 border-b-2 border-b-zinc-300">
          <div>
            <Avatar src={userInfo?.[0]?.avatarUrl || '/'} rainbow width={190} />
          </div>
          <div className="my-5">
            <div className="flex items-center">
              <h1 className="text-3xl ">{emailNamePart}</h1>
              {!isMe && (
                <div className="static text-3xl ml-12 text-white font-semibold p-2 rounded-xl">
                  <PulseLoader
                    color="black"
                    size={13}
                    loading={isLoading}
                    data-testid="loadingSpinner"
                    speedMultiplier={0.8}
                    className="z-20 absolute translate-x-20"
                  />
                  {isFollowing === true && (
                    <button
                      className={`bg-red-500  ${BUTTON_CLASS}`}
                      data-testid="unfollow"
                      name="unfollow"
                      onClick={onClick}
                      disabled={isLoading}
                    >
                      Unfollow
                    </button>
                  )}
                  {isFollowing === false && (
                    <button
                      className={`bg-sky-500 ${BUTTON_CLASS}`}
                      name="follow"
                      data-testid="follow"
                      onClick={onClick}
                      disabled={isLoading}
                    >
                      Follow
                    </button>
                  )}
                  {/* to be deleted */}
                  {isFollowing === undefined && (
                    <button>You are logged out!</button>
                  )}
                </div>
              )}
            </div>
            <div className={ENTITY_OUTER_CONTAINER_CLASS}>
              <div className={ENTITY_INNER_CONTAINER_CLASS}>
                <p className={COUNT_CLASS}>
                  {userInfo?.[0]?.posts?.length || '0'}
                </p>
                <p className={ENTITY_CLASS}>posts</p>
              </div>
              <div className={ENTITY_INNER_CONTAINER_CLASS}>
                <p className={COUNT_CLASS}>{userInfo?.[0]?.followers || '0'}</p>
                <p className={ENTITY_CLASS}>followers</p>
              </div>
              <div className={ENTITY_INNER_CONTAINER_CLASS}>
                <p className={COUNT_CLASS}>
                  {userInfo?.[0]?.following?.length || '0'}
                </p>
                <p className={ENTITY_CLASS}>following</p>
              </div>
            </div>
            <p className="font-semibold text-2xl my-1">{userInfo?.[0]?.name}</p>
          </div>
        </section>
      }
    </div>
  );
}
