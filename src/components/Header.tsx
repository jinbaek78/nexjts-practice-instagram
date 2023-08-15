'use client';

import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
import { BiSearch, BiSolidSearchAlt2 } from 'react-icons/bi';
import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs';
import Button from './Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ICON_CLASS = 'mr-6';
export default function Header() {
  const { data: session } = useSession();
  const buttonText = session ? 'Sign out' : 'Sign in';
  const pathname = usePathname();
  return (
    <header className="flex justify-between my-2  p-2 max-w-screen-2xl mx-auto ">
      <section className="flex flex-col justify-center items-center">
        <Link href={'/'}>
          <h1 className="font-bold text-4xl">Instagram</h1>
        </Link>
      </section>
      <nav className="flex justify-evenly items-center text-3xl">
        <Link href={'/'} className={ICON_CLASS}>
          {pathname === '/' ? <AiFillHome /> : <AiOutlineHome />}
        </Link>

        <Link href={'/search'} className={ICON_CLASS}>
          {pathname === '/search' ? <BiSolidSearchAlt2 /> : <BiSearch />}
        </Link>

        <Link href={'/new'} className={ICON_CLASS}>
          {pathname === '/new' ? <BsPlusSquareFill /> : <BsPlusSquare />}
        </Link>
        <div className={ICON_CLASS}>
          <Button text={buttonText} />
        </div>
      </nav>
    </header>
  );
}
