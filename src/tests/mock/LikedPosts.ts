const mockedLikedPosts = jest.fn();
jest.mock('@/components/LikedPosts', () => mockedLikedPosts);
export default mockedLikedPosts;
