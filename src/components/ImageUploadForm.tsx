import { publishPost, storeImageFileToCMS } from '@/services/sanity';
import Image from 'next/image';
import { ChangeEvent, DragEvent, FormEvent, useState } from 'react';
import { FaPhotoVideo } from 'react-icons/fa';
import { GridLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ImageUploadForm() {
  const { data: session } = useSession();
  const [imageFile, setImageFile] = useState<globalThis.File | undefined>(
    undefined
  );
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    return storeImageFileToCMS(imageFile) //
      .then(({ imgAssetId, imgUrl }) =>
        publishPost({ comment: text, imgAssetId, imgUrl, session })
      )
      .then(() => {
        setIsLoading(false);
        router.push('/');
      });
  };
  const handleTextChange = (event: ChangeEvent) => {
    const text = (event.target as HTMLTextAreaElement).value;
    setText(text);
  };

  const handleFileChange = (event: ChangeEvent) => {
    let imgFile: globalThis.File | undefined;

    if (event.target) {
      imgFile = (event.target as HTMLInputElement)?.files?.[0];
    }
    const url = URL.createObjectURL(imgFile!);
    setImageFile(imgFile);
  };

  function handleDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    const files = event?.dataTransfer?.files;
    setImageFile(files[0]);
  }

  function handleDragenter(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleDragover(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label
        data-testid="uploaderlabel"
        htmlFor="uploadInput"
        className=" w-full h-96 border border-dashed border-sky-500  flex flex-col justify-center items-center text-8xl"
        onDragEnter={handleDragenter}
        onDragOver={handleDragover}
        onDrop={handleDrop}
      >
        {imageFile && (
          <Image
            className="w-full h-96"
            src={URL.createObjectURL(imageFile) || '/'}
            alt="urlForThumbnail"
            width={100}
            height={100}
          />
        )}
        {!imageFile && (
          <div className="flex flex-col justify-center items-center p-44 ">
            <div className="text-zinc-300">
              <FaPhotoVideo />
            </div>
            <input
              data-testid="uploader"
              className="clip-pattern"
              id="uploadInput"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="uploadInput">
              <p className="text-2xl">Drag and Drop your Image here or Click</p>
            </label>
          </div>
        )}
      </label>
      <div className="static">
        <textarea
          data-testid="textarea"
          className=" max-x-5xl text-3xl outline-none p-2"
          rows={15}
          cols={60}
          placeholder="Write a caption"
          value={text}
          onChange={handleTextChange}
        ></textarea>
        <GridLoader
          className="absolute left-1/2 top-1/2"
          color="red"
          loading={isLoading}
          margin={2}
          size={20}
        />
      </div>
      <div></div>
      <button
        disabled={isLoading}
        className="w-full p-3 text-white font-bold bg-sky-500 text-2xl rounded-lg"
        type="submit"
      >
        Publish
      </button>
    </form>
  );
}
