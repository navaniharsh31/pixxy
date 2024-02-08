"use client";
import { useAtomValue } from "jotai";
import RightPanel from "./components/right-panel";
import EditorSidebar from "./components/sidebar";
import { selectedImageAtom } from "@/state";
import ImageSelector from "./components/image-selector";
import ImageEditor from "./components/image-editor";
const Editor = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="min-h-[60px] border-b border-gray-300 flex items-center justify-start px-4">
        <h1 className="text-orange-500 font-bold text-2xl">Pixxy</h1>
      </div>

      <div className="flex flex-grow flex-col h-full overflow-hidden">
        <div className="flex-grow grid grid-cols-16 h-full max-h-full">
          <div className="col-span-1">
            <EditorSidebar />
          </div>

          <div className="col-span-11 border-r flex items-center justify-center p-12 border-gray-300 overflow-hidden">
            {!selectedImage ? (
              <ImageSelector />
            ) : (
              <ImageEditor image={selectedImage} />
            )}
          </div>

          <div className="col-span-4 overflow-hidden h-full">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
