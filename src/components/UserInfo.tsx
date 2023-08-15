import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Avatar from './Avatar';

export default function UserInfo() {
  const { data: session } = useSession();
  const { name, email, image } = session!.user!;

  return (
    <section className="flex flex-col gap-10">
      <Avatar src={image || ''} email={email || ''} name={name || ''} />
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
