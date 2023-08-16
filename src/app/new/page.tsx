'use client';

import Avatar from '@/components/Avatar';
import ImageUploadForm from '@/components/ImageUploadForm';
import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';

export default function NewPostPage() {
  const { data: session } = useSession();
  redirectToSigninIfLoggedOut(session);
  const { email, image, name } = session!.user!;
  return (
    <main className="flex flex-col items-center justify-center">
      <section className="my-7">
        <Avatar src={image || ''} email={email || ''} />
      </section>
      <ImageUploadForm username={name || ''} />
    </main>
  );
}
