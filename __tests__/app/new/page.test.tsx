import '@/tests/mock/ImageUploadForm';
import ImageUploadForm from '@/tests/mock/ImageUploadForm';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/Avatar';
import { fakeSession } from '@/tests/mock/session';
import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';
import NewPostPage from '@/app/new/page';

jest.mock('@/components/Avatar');
jest.mock('@/utils/redirect');
jest.mock('next-auth/react');

describe('NewPostPage', () => {
  it('"renders properly with session information', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    const { email, image, name } = fakeSession.user!;
    render(<NewPostPage />);
    expect(redirectToSigninIfLoggedOut).toHaveBeenCalledTimes(1);
    expect(redirectToSigninIfLoggedOut).toHaveBeenCalledWith(fakeSession);
    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0]).toEqual({
      email,
      src: image,
    });
    expect(ImageUploadForm).toHaveBeenCalledTimes(1);
    expect((ImageUploadForm as jest.Mock).mock.calls[0][0]).toEqual({
      username: name,
    });
  });
  //
});
