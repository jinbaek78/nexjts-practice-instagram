'use client';

import Avatar from '@/components/Avatar';
import ImageUploadForm from '@/components/ImageUploadForm';
import { removeAllPosts } from '@/services/sanity';
import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';

export default function NewPostPage() {
  const { data: session } = useSession();
  redirectToSigninIfLoggedOut(session);
  const { email, image: src, name } = session!.user!;
  return (
    <main className="flex flex-col items-center justify-center">
      <section className="flex items-center my-7">
        <Avatar src={src || ''} />
        <div className="ml-5">
          <h3 className="text-3xl font-bold">{email && email.split('@')[0]}</h3>
        </div>
      </section>
      <ImageUploadForm />
    </main>
  );
}
