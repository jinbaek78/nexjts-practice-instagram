import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export function redirectToSigninIfLoggedOut(session: Session | null) {
  if (!session) {
    return redirect('/auth/signin');
  }
}

export function redirectToHomeIfLoggedIn(session: Session | null) {
  if (session) {
    return redirect('/');
  }
}
