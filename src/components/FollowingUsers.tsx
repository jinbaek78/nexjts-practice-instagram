import { getAllUsers, getFollowingUserInfo } from '@/services/sanity';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Avatar from './Avatar';
import { PropagateLoader } from 'react-spinners';
import UsersCarousel from '@/components/UsersCarousel';
import Link from 'next/link';

export type FollowingUser = {
  avatarUrl: string;
  name: string;
};
export default function FollowingUsers() {
  const { data: session } = useSession();
  const { data: allUsers } = useSWR('allUsers', () => getAllUsers());
  const { isLoading, data: followingUsers } = useSWR(`followingUsers`, () =>
    getFollowingUserInfo(allUsers, session)
  );
  return (
    <div className="w-full h-44 shadow-md rounded-md ">
      {isLoading && (
        <PropagateLoader
          color="red"
          loading={isLoading}
          className="w-full h-full relative left-1/2 top-1/2"
        />
      )}
      {followingUsers && (
        <ul className="w-full flex justify-between p-5">
          {followingUsers?.length > 4 ? (
            <UsersCarousel>
              {followingUsers?.map(({ avatarUrl, name }: FollowingUser) => (
                <Link href={`/user/${name}}?name=${name}`} key={name}>
                  <div
                    key={name}
                    className="flex flex-col justify-center items-center"
                  >
                    <Avatar src={avatarUrl} rainbow />
                    <p className="text-xl font-medium ">{name}</p>
                  </div>
                </Link>
              ))}
            </UsersCarousel>
          ) : (
            <>
              {followingUsers?.map(({ avatarUrl, name }: FollowingUser) => (
                <Link href={`/user/${name}}`} key={name}>
                  <li
                    key={name}
                    className="flex flex-col justify-center items-center"
                  >
                    <Avatar src={avatarUrl} rainbow />
                    <p className="text-xl font-medium ">{name}</p>
                  </li>
                </Link>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
