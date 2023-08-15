'use client';
import Button from '@/components/Button';
import { redirectToHomeIfLoggedIn } from '@/utils/redirect';
import { useSession } from 'next-auth/react';

export default function SigninPage() {
  const { data: session } = useSession();
  redirectToHomeIfLoggedIn(session);
  return (
    <div className="w-full flex justify-center my-36">
      <Button text="Sign In With Google" textSize="text-2xl" css="p-5" />
    </div>
  );
}
