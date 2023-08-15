import {
  redirectToHomeIfLoggedIn,
  redirectToSigninIfLoggedOut,
} from '@/utils/redirect';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Redirect', () => {
  const fakeSession: Session = {
    user: {
      email: 'abded@gmail.com',
      image: '"https://lh3.googleusercontent.com/a/ad"',
      name: 'jin',
    },
    expires: '2023-09-14T08:21:23.720Z',
  };

  afterEach(() => {
    (redirect as unknown as jest.Mock).mockReset();
  });

  describe('redirectToSigninIfLoggedOut', () => {
    it("should redirect them to the '/auth/signin' page when a user is not logged in", () => {
      redirectToSigninIfLoggedOut(null);
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith('/auth/signin');
    });

    it('should not redirect them to /auth/signin when a user is logged in', () => {
      redirectToSigninIfLoggedOut(fakeSession);
      expect(redirect).not.toBeCalled();
    });
  });

  describe('redirectToHomeIfLoggedIn', () => {
    it('should redirect them to the home page when a user is logged in', () => {
      redirectToHomeIfLoggedIn(fakeSession);
      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith('/');
    });

    it('should not redirect them to the home page when a user is logged out', () => {
      redirectToHomeIfLoggedIn(null);
      expect(redirect).not.toBeCalled();
    });
  });
});
