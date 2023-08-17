import { useSession } from 'next-auth/react';
import Avatar from './Avatar';

export default function UserInfo() {
  const { data: session } = useSession();
  const { name, email, image: src } = session!.user!;

  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-center">
        <Avatar src={src || ''} />
        <div className="ml-5">
          <h3 className="text-xl font-bold">{email && email.split('@')[0]}</h3>
          {name && <h3 className="text-2xl text-zinc-600">{name}</h3>}
        </div>
      </div>
      <p className="text-zinc-600 text-lg">
        About﹒ Help﹒Press﹒API﹒Jobs﹒
        <br />
        Privacy﹒Terms﹒Location﹒
        <br />
        Language
      </p>
      <p className="text-zinc-700 font-semibold">
        Copyright INSTANTGARM
        <br />
        from MENTAL
      </p>
    </section>
  );
}
