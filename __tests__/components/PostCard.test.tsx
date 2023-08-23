import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
//
import Avatar from '@/components/Avatar';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import userEvent from '@testing-library/user-event';
import { FaRegSmile } from 'react-icons/fa';
import {
  addCommentToPost,
  addPostIdToUserInfo,
  removePostIdFromUserInfo,
} from '@/services/sanity';
import { format } from 'timeago.js';
import { v4 as uuidv4 } from 'uuid';
import { fakePosts } from '@/tests/mock/posts';
import PostCard from '@/components/PostCard';
import { Post } from '@/types/post';
import { fakeSession } from '@/tests/mock/session';

jest.mock('@/components/Avatar');
jest.mock('react-icons/ai');
jest.mock('react-icons/bs');
jest.mock('react-icons/fa');
jest.mock('@/services/sanity', () => ({
  addCommentToPost: jest.fn(),
  addPostIdToUserInfo: jest.fn(),
  removePostIdFromUserInfo: jest.fn(),
}));

jest.mock('timeago.js');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('PostCard', () => {
  const fakePost: Post = fakePosts[0];
  const notMarkedAndNotLikedPost = fakePosts[0];
  const markedAndLikedPost = fakePosts[1];
  const fakePostGotOnlyOneComment = fakePost;
  const fakePostGotTwoComment = fakePosts[1];
  const fakeIndex = 0;
  const FAKE_ID = 'fakeId';
  const FAKE_KEY1 = 'fakeKey1';
  const FAKE_KEY2 = 'fakeKey2';
  const FAKE_KEY3 = 'fakeKey3';
  const FAKE_KEY4 = 'fakeKey4';
  const FAKE_KEY5 = 'fakeKey5';
  const FAKE_KEY6 = 'fakeKey6';
  const FAKE_KEY7 = 'fakeKey7';
  const FAKE_KEY8 = 'fakeKey8';
  const FAKE_KEY9 = 'fakeKey9';
  const FAKE_KEY10 = 'fakeKey10';
  const fakeKeys = [
    FAKE_KEY1,
    FAKE_KEY2,
    FAKE_KEY3,
    FAKE_KEY4,
    FAKE_KEY5,
    FAKE_KEY6,
    FAKE_KEY7,
    FAKE_KEY8,
    FAKE_KEY9,
    FAKE_KEY10,
  ];
  const mockedOnUpdated = jest.fn();

  beforeEach(() => {
    uuidv4 as jest.Mock;
    for (let i = 0; i < fakeKeys.length; i++) {
      (uuidv4 as jest.Mock).mockReturnValueOnce(fakeKeys[i]);
    }
  });

  afterEach(() => {
    //
    (Avatar as jest.Mock).mockReset();
    (AiOutlineHeart as jest.Mock).mockReset();
    (AiFillHeart as jest.Mock).mockReset();
    (BsBookmark as jest.Mock).mockReset();
    (BsBookmarkFill as jest.Mock).mockReset();
    (FaRegSmile as jest.Mock).mockReset();

    (addCommentToPost as jest.Mock).mockReset();
    (addPostIdToUserInfo as jest.Mock).mockReset();
    (removePostIdFromUserInfo as jest.Mock).mockReset();
    (format as jest.Mock).mockReset();
    mockedOnUpdated.mockClear();
  });

  it('should render with post details', () => {
    // (uuidv4 as jest.Mock).mockImplementation(() => FAKE_ID);
    const {
      _id: postId,
      avatarUrl,
      imgUrl,
      name: username,
      comments,
      _createdAt,
      isLiked,
      likes,
      isMarked,
    } = fakePost;

    render(
      <PostCard
        index={fakeIndex}
        post={fakePost}
        onUpdated={mockedOnUpdated}
        session={fakeSession}
      />
    );

    expect(Avatar).toHaveBeenCalledTimes(2 + fakePost.comments.length);
    const src = (screen.getByRole('img') as HTMLImageElement).src;
    expect(src).toMatch(fakePost.imgUrl.split('/')[1]);
    expect(screen.getAllByText(username)).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(
      fakePost.comments.length
    );
    expect(format).toHaveBeenCalledTimes(2);
    expect((format as jest.Mock).mock.calls[0][0]).toBe(fakePost._createdAt);
    expect((format as jest.Mock).mock.calls[1][0]).toBe(fakePost._createdAt);
    expect(isLiked ? AiFillHeart : AiOutlineHeart).toHaveBeenCalledTimes(2);
    expect(isMarked ? BsBookmarkFill : BsBookmark).toHaveBeenCalledTimes(2);
    expect(screen.getAllByText(`${likes} like`)).toHaveLength(2);
    expect(FaRegSmile).toHaveBeenCalledTimes(2);
  });

  describe('BookMark Button', () => {
    it('should call the addPostIdToUserInfo method with the correct arguments when a user clicks the unfilled bookmark button', async () => {
      (addPostIdToUserInfo as jest.Mock).mockImplementation(
        (post, type, callback) => callback()
      );
      render(
        <PostCard
          index={fakeIndex}
          post={notMarkedAndNotLikedPost}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      const bookMarkButton = screen.getByTestId('markButton');
      const updatedPost = {
        ...notMarkedAndNotLikedPost,
        isMarked: true,
      };

      await fireEvent.click(bookMarkButton);

      expect(BsBookmark).toHaveBeenCalledTimes(2);
      expect(BsBookmarkFill).not.toBeCalled();
      expect(addPostIdToUserInfo).toHaveBeenCalledTimes(1);
      expect((addPostIdToUserInfo as jest.Mock).mock.calls[0][0]).toStrictEqual(
        notMarkedAndNotLikedPost
      );
      expect((addPostIdToUserInfo as jest.Mock).mock.calls[0][1]).toBe(
        'marked'
      );
      expect(mockedOnUpdated).toHaveBeenCalledTimes(1);
      expect(mockedOnUpdated).toHaveBeenCalledWith(fakeIndex, updatedPost);
    });
    it('should call the removePostIdFromUserInfo method with the correct arguments when a user clicks the filled bookmark button', async () => {
      (removePostIdFromUserInfo as jest.Mock).mockImplementation(
        (post, type, callback) => callback()
      );

      render(
        <PostCard
          index={fakeIndex}
          post={markedAndLikedPost}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      const bookMarkButton = screen.getByTestId('markButton');
      const updatedPost = {
        ...markedAndLikedPost,
        isMarked: false,
      };

      await fireEvent.click(bookMarkButton);

      expect(BsBookmarkFill).toHaveBeenCalledTimes(2);
      expect(BsBookmark).not.toBeCalled();
      expect(removePostIdFromUserInfo).toHaveBeenCalledTimes(1);
      expect(
        (removePostIdFromUserInfo as jest.Mock).mock.calls[0][0]
      ).toStrictEqual(markedAndLikedPost);
      expect((removePostIdFromUserInfo as jest.Mock).mock.calls[0][1]).toBe(
        'marked'
      );
      expect(mockedOnUpdated).toHaveBeenCalledTimes(1);
      expect(mockedOnUpdated).toHaveBeenCalledWith(fakeIndex, updatedPost);
    });
  });

  describe('Like Button', () => {
    it('should call the addPostIdToUserInfo method with the correct arguments when a user clicks the unfilled like button', async () => {
      (addPostIdToUserInfo as jest.Mock).mockImplementation(
        (post, type, callback) => callback()
      );
      render(
        <PostCard
          index={fakeIndex}
          post={notMarkedAndNotLikedPost}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      const likeButton = screen.getByTestId('likeButton');
      const updatedPost = {
        ...notMarkedAndNotLikedPost,
        likes: notMarkedAndNotLikedPost.likes + 1,
        isLiked: true,
      };

      await fireEvent.click(likeButton);

      expect(AiOutlineHeart).toHaveBeenCalledTimes(2);
      expect(AiFillHeart).not.toBeCalled();
      expect(addPostIdToUserInfo).toHaveBeenCalledTimes(1);
      expect((addPostIdToUserInfo as jest.Mock).mock.calls[0][0]).toStrictEqual(
        notMarkedAndNotLikedPost
      );
      expect((addPostIdToUserInfo as jest.Mock).mock.calls[0][1]).toBe('liked');
      expect(mockedOnUpdated).toHaveBeenCalledTimes(1);
      expect(mockedOnUpdated).toHaveBeenCalledWith(fakeIndex, updatedPost);
    });

    it('should call the removePostIdFromUserInfo method with the correct arguments when a user clicks the unfilled like button', async () => {
      (removePostIdFromUserInfo as jest.Mock).mockImplementation(
        (post, type, callback) => callback()
      );

      render(
        <PostCard
          index={fakeIndex}
          post={markedAndLikedPost}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      const likeButton = screen.getByTestId('likeButton');
      const updatedPost = {
        ...markedAndLikedPost,
        likes: markedAndLikedPost.likes - 1,
        isLiked: false,
      };

      await fireEvent.click(likeButton);

      expect(BsBookmarkFill).toHaveBeenCalledTimes(2);
      expect(BsBookmark).not.toBeCalled();
      expect(removePostIdFromUserInfo).toHaveBeenCalledTimes(1);
      expect(
        (removePostIdFromUserInfo as jest.Mock).mock.calls[0][0]
      ).toStrictEqual(markedAndLikedPost);
      expect((removePostIdFromUserInfo as jest.Mock).mock.calls[0][1]).toBe(
        'liked'
      );
      expect(mockedOnUpdated).toHaveBeenCalledTimes(1);
      expect(mockedOnUpdated).toHaveBeenCalledWith(fakeIndex, updatedPost);
    });
  });

  describe('Submit', () => {
    const { name: username } = fakePost;
    const comment = 'test';
    it('should call addCommentToPost method with the correct arguments when a user types a comment and press the enter key to submit', async () => {
      (addCommentToPost as jest.Mock).mockImplementation(
        (post, type, callback) => callback()
      );
      render(
        <PostCard
          index={fakeIndex}
          post={fakePost}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      const input = screen.getByTestId('commentInput');
      const newComment = {
        comment,
        username,
        // _key: FAKE_KEY3,
        _key: FAKE_KEY3,
      };
      const updatedPost = {
        ...fakePost,
        comments: [...fakePost.comments, newComment],
      };

      // await fireEvent.change(input, { target: { value: comment } });
      // await fireEvent.click(submitButton);
      await userEvent.type(input, `${comment}{enter}`);

      expect(addCommentToPost).toHaveBeenCalledTimes(1);
      // expect((addCommentToPost as jest.Mock).mock.calls[0][0]).toBe('');
      expect((addCommentToPost as jest.Mock).mock.calls[0][0]).toEqual(
        newComment
      );
      expect((addCommentToPost as jest.Mock).mock.calls[0][1]).toBe(
        fakePost._id
      );
      expect(mockedOnUpdated).toHaveBeenCalledTimes(1);
      expect(mockedOnUpdated).toHaveBeenCalledWith(fakeIndex, updatedPost);
    });

    it('should call addCommentToPost method with the correct arguments when a user types a comment and click the post button to submit', async () => {
      (addCommentToPost as jest.Mock).mockImplementation(
        (post, type, callback) => callback()
      );
      render(
        <PostCard
          index={fakeIndex}
          post={fakePost}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      const input = screen.getByTestId('commentInput');
      const submitButton = screen.getByTestId('submitButton');
      const newComment = {
        comment,
        username,
        _key: FAKE_KEY6,
      };
      const updatedPost = {
        ...fakePost,
        comments: [...fakePost.comments, newComment],
      };

      await userEvent.type(input, comment);
      await userEvent.click(submitButton);

      expect(addCommentToPost).toHaveBeenCalledTimes(1);
      expect((addCommentToPost as jest.Mock).mock.calls[0][0]).toEqual(
        newComment
      );
      expect((addCommentToPost as jest.Mock).mock.calls[0][1]).toBe(
        fakePost._id
      );
      expect(mockedOnUpdated).toHaveBeenCalledTimes(1);
      expect(mockedOnUpdated).toHaveBeenCalledWith(fakeIndex, updatedPost);
    });
  });

  describe('Comment', () => {
    it('should display comment message when there is a only one comment left', async () => {
      const { comment, username } = fakePostGotOnlyOneComment.comments[0];
      render(
        <PostCard
          index={fakeIndex}
          post={fakePostGotOnlyOneComment}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );

      waitFor(() => {
        expect(screen.getByRole('listitem')).toBeInTheDocument();
      });

      expect(screen.getAllByText(comment)).toHaveLength(2);
      expect(screen.getAllByText(username)).toHaveLength(2);
      expect(screen.queryByText(`View all ${length} comments`)).toBeNull();
    });

    it('should display view all comments message when there is more than or equal to two comments', async () => {
      const length = fakePostGotTwoComment.comments.length;
      render(
        <PostCard
          index={fakeIndex}
          post={fakePostGotTwoComment}
          onUpdated={mockedOnUpdated}
          session={fakeSession}
        />
      );
      waitFor(() => {
        expect(screen.getByRole('listitem')).toBeInTheDocument();
      });

      expect(
        screen.getByText(`View all ${length} comments`)
      ).toBeInTheDocument();
    });
  });

  describe('Modal', () => {
    beforeAll(() => {
      HTMLDialogElement.prototype.showModal = jest.fn();
      HTMLDialogElement.prototype.close = jest.fn();
    });

    describe('Open-Close', () => {
      afterEach(() => {
        (HTMLDialogElement.prototype.showModal as jest.Mock).mockClear();
        (HTMLDialogElement.prototype.close as jest.Mock).mockClear();
      });
      it('should open the post modal when a user clicks a post image', async () => {
        render(
          <PostCard
            index={fakeIndex}
            post={fakePostGotTwoComment}
            onUpdated={mockedOnUpdated}
            session={fakeSession}
          />
        );
        const postImage = screen.getByTestId('postImage');
        const modal = screen.getByTestId('modal') as HTMLDialogElement;

        await userEvent.click(postImage);

        // waitFor(() => {}, { timeout: 1000 });
        // await userEvent.click(modal);

        // waitFor(() => {}, { timeout: 1000 });

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
        expect(HTMLDialogElement.prototype.close).not.toBeCalled();
        // expect(modal.dialogVisible).toBe('');
        // await userEvent.click(postImage);
      });

      it('should close the post modal when a user clicks the backdrop space', async () => {
        render(
          <PostCard
            index={fakeIndex}
            post={fakePostGotTwoComment}
            onUpdated={mockedOnUpdated}
            session={fakeSession}
          />
        );
        const postImage = screen.getByTestId('postImage');
        const modal = screen.getByTestId('modal') as HTMLDialogElement;
        await userEvent.click(postImage);
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
        expect(HTMLDialogElement.prototype.close).not.toBeCalled();

        await userEvent.click(modal);

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
      });
    });
  });
});
