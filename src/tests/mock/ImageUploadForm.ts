const mockedImageUploadForm = jest.fn();
jest.mock('@/components/ImageUploadForm', () => mockedImageUploadForm);

export default mockedImageUploadForm;
