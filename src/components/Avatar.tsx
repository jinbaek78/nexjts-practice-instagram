import Image from 'next/image';

type Props = {
  src: string;
  email: string;
  name?: string;
};
export default function Avatar({ src, email, name }: Props) {
  return (
    <div className="flex items-center">
      <Image
        className="rounded-full"
        src={src || ''}
        alt="avatar"
        width={80}
        height={100}
      />
      <div className="ml-5">
        <h3 className="text-xl font-bold">{email && email.split('@')[0]}</h3>
        {name && <h3 className="text-2xl text-zinc-600">{name}</h3>}
      </div>
    </div>
  );
}
