import Image from 'next/image';

type Props = {
  src: string;
  rainbow?: boolean;
  width?: number;
};
const IMAGE_CONTAINER_CLASS =
  'rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 w-full';
export default function Avatar({ src, rainbow = false, width = 100 }: Props) {
  return (
    <>
      <div
        className={rainbow ? IMAGE_CONTAINER_CLASS : 'rounded-full'}
        style={{
          borderRadius: '999px',
          overflow: 'hidden',
          width: `${width}px`,
          height: `${width}px`,
          objectFit: 'cover',
        }}
      >
        <Image
          className="rounded-full bg-white p-1 w-full h-full"
          src={src || ''}
          alt="avatar"
          width={width}
          height={100}
        />
      </div>
    </>
  );
}
