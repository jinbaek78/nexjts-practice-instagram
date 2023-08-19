import { getFollowingUserInfo } from '@/services/sanity';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Avatar from './Avatar';
import { PropagateLoader } from 'react-spinners';
import UsersCarousel from '@/components/UsersCarousel';

export type FollowingUser = {
  avatarUrl: string;
  name: string;
};
export default function FollowingUsers() {
  const { data: session } = useSession();
  const {
    data: followingList,
    error,
    isLoading,
  } = useSWR(`${session?.user?.name}`, () => getFollowingUserInfo(session));
  return (
    <div className="w-full h-44 shadow-md rounded-md ">
      {isLoading && (
        <PropagateLoader
          color="red"
          loading={isLoading}
          className="w-full h-full relative left-1/2 top-1/2"
        />
      )}
      {followingList && (
        <ul className="w-full flex justify-between p-5">
          {followingList?.length > 4 ? (
            <UsersCarousel>
              {followingList?.map(({ avatarUrl, name }: FollowingUser) => (
                <div
                  key={name}
                  className="flex flex-col justify-center items-center"
                >
                  <Avatar src={avatarUrl} rainbow />
                  <p className="text-xl font-medium ">{name}</p>
                </div>
              ))}
            </UsersCarousel>
          ) : (
            <>
              {followingList?.map(({ avatarUrl, name }: FollowingUser) => (
                <li
                  key={name}
                  className="flex flex-col justify-center items-center"
                >
                  <Avatar src={avatarUrl} rainbow />
                  <p className="text-xl font-medium ">{name}</p>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
