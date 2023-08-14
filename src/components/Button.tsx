'use client';
import { signIn, signOut } from 'next-auth/react';

type Props = {
  text: 'Sign in' | 'Sign out' | 'Sign In With Google';
  textSize?: string;
  css?: string;
};
const BUTTON_CONTAINER_CLASS =
  'rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1';
const BUTTON_CLASS =
  'p-2 h-full w-full bg-gray-50 font-medium hover:bg flex flex-col justify-center items-center hover:bg-rose-100';
export default function Button({ text, textSize = 'text-xl', css }: Props) {
  const handleClick = () => {
    if (text === 'Sign in' || text === 'Sign In With Google') {
      signIn('google', { callbackUrl: '/' });
      return;
    }

    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className={`${BUTTON_CONTAINER_CLASS} ${textSize}`}>
      <button className={`${BUTTON_CLASS} ${css}`} onClick={handleClick}>
        {text}
      </button>
    </div>
  );
}
