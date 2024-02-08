"use client";
import { selectedImageAtom } from "@/state";
import { useSetAtom } from "jotai";
import { useRef } from "react";
import { FaImage } from "react-icons/fa6";

const ImageSelector = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setSelectImage = useSetAtom(selectedImageAtom);

  const handleOnClick = () => {
    inputRef.current?.click();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectImage(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className="w-96 h-96 bg-gray-100 cursor-pointer rounded-lg flex flex-col items-center justify-center"
    >
      <FaImage size={96} className="text-gray-300" />
      <p className="text-gray-500 text-lg">Upload image from device</p>
      <p className="text-gray-500 text-sm">Allowed formats: jpg, png, jpeg</p>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleOnChange}
      />
    </div>
  );
};

export default ImageSelector;
