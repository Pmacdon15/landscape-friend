import ImageUploadInput from "../inputs/image-upload-input";
import UploadImageButton from "../buttons/upload-image-button";

export default function ImageUploader({ clientId, setView }: { clientId: number, setView: React.Dispatch<React.SetStateAction<string>> }) {
  
  return (
    <form className="w-[45%]">
      <label className="cursor-pointer relative flex flex-col w-full gap-2">
        <ImageUploadInput />
        <UploadImageButton clientId={clientId} setView={setView } />
      </label>
    </form >
  );
}
