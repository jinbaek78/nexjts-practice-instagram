import { User } from '@/types/user';
import Avatar from './Avatar';
import Link from 'next/link';

type Props = {
  userInfo: User;
};
export default function UserCard({ userInfo }: Props) {
  const { avatarUrl, emailName, name, followers, following } = userInfo;
  return (
    <Link
      href={`/user/${name}?name=${name}`}
      className="w-full max-w-2xl p-5 px-7 my-1 flex items-center border-[1px] border-zinc-300 bg-white"
    >
      <div>
        <Avatar src={avatarUrl || '/'} width={80} />
      </div>
      <div className="text-xl flex flex-col ml-2">
        <span className="font-bold leading-6">{emailName.split('@')[0]}</span>
        <span className="text-zinc-500 leading-6">{name}</span>
        <div className="flex gap-1 text-zinc-500 leading-6 ">
          <span>{followers}</span>
          <span className="">followers</span>
          <span>{following?.length || '0'}</span>
          <span>following</span>
        </div>
      </div>
    </Link>
  );
}
