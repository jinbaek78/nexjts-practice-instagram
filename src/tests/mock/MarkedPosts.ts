const mockedMarkedPosts = jest.fn();
jest.mock('@/components/MarkedPosts', () => mockedMarkedPosts);
export default mockedMarkedPosts;
