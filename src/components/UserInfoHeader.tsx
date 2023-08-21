'use client';
import Avatar from './Avatar';
import { User } from '@/types/user';

const COUNT_CLASS = 'font-bold mr-1 text-2xl';
const ENTITY_CLASS = 'text-2xl';
const ENTITY_OUTER_CONTAINER_CLASS = 'flex my-2 gap-3 gap-y-5 items-between';
const ENTITY_INNER_CONTAINER_CLASS = 'flex items-center my-2';

type Props = {
  userInfo: (User | undefined)[];
};

export default function UserInfoHeader({ userInfo }: Props) {
  return (
    <div>
      {
        <section className="flex justify-center items-center gap-6 p-1 py-10 border-b-2 border-b-zinc-300">
          <div>
            <Avatar src={userInfo?.[0]?.avatarUrl || '/'} rainbow width={190} />
          </div>
          <div className="my-5">
            <h1 className="text-3xl ">{userInfo?.[0]?.emailName}</h1>
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
