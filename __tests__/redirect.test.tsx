import { fakeSession } from '@/tests/mock/session';
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
