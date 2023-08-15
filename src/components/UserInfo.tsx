import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function UserInfo() {
  const { data: session } = useSession();
  const { name, email, image } = session!.user!;

  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-center">
        <Image
          className="rounded-full"
          src={image || ''}
          alt="avatar"
          width={80}
          height={100}
        />
        <div className="ml-5">
          <h3 className="text-xl font-bold">{email && email.split('@')[0]}</h3>
          <h3 className="text-2xl text-zinc-600">{name}</h3>
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
