import {
  createEvent,
  fireEvent,
  getByAltText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { GridLoader } from 'react-spinners';
import { FaPhotoVideo } from 'react-icons/fa';
import { publishPost, storeImageFileToCMS } from '@/services/sanity';
import ImageUploadForm from '@/components/ImageUploadForm';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fakeSession } from '@/tests/mock/session';

global.URL.createObjectURL = jest.fn();

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
jest.mock('@/services/sanity', () => ({
  publishPost: jest.fn(),
  storeImageFileToCMS: jest.fn(async () => ({
    imgUrl: 'imgUrl',
    imgAssetId: 'imgAssetId',
  })),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-icons/fa');
jest.mock('react-spinners');

describe('ImageUploadForm', () => {
  const imgUrl = 'imgUrl';
  const imgAssetId = 'imgAssetId';
  const content = 'content';
  const author = 'author';

  beforeEach(() => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: fakeSession,
    }));
  });

  afterEach(() => {
    (useSession as jest.Mock).mockReset();
  });

  it('should upload a image file and text to the CMS', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({ push }));
    render(<ImageUploadForm />);
    await waitFor(() => {}, { timeout: 1000 });
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('uploader') as HTMLInputElement;
    await userEvent.upload(input, file);
    const textarea = screen.getByTestId('textarea');
    await userEvent.type(textarea, 'comment');
    const button = screen.getByRole('button');
    await userEvent.click(button);
    const postData = {
      comment: 'comment',
      imgUrl,
      imgAssetId,
      session: fakeSession,
    };

    expect(input.files?.[0]).toBe(file);
    expect(input.files?.item(0)).toBe(file);
    expect(input.files).toHaveLength(1);
    expect(storeImageFileToCMS).toHaveBeenCalledTimes(1);
    expect(storeImageFileToCMS).toHaveBeenCalledWith(file);
    expect(publishPost).toHaveBeenCalledTimes(1);
    // expect(publishPost).toHaveBeenCalledWith('');
    expect(publishPost).toHaveBeenCalledWith(postData);
    expect(useRouter).toBeCalled();
    expect(GridLoader).toBeCalled();
    expect(FaPhotoVideo).toBeCalled();
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/');
  });

  // 'should handle a image file being added using drag and drop
  it('should catch an image file and display it as thumbnails when a user drags and drops that file', async () => {
    render(<ImageUploadForm />);
    const file = new File(['test'], 'test.png', {
      type: 'image/png',
    });
    const fileList = [file];
    const fileDropzone = screen.getByTestId(
      'uploaderlabel'
    ) as HTMLLabelElement;
    const fileDropEvent = createEvent.drop(fileDropzone);
    Object.defineProperty(fileDropEvent, 'dataTransfer', {
      value: {
        files: fileList,
      },
    });

    await fireEvent(fileDropzone, fileDropEvent);

    await waitFor(() => {
      expect(screen.getByAltText('urlForThumbnail')).toBeInTheDocument();
    });
    // expect(screen.getByAltText('urlForThumbnail')).toBeInTheDocument();
  });
});
