"use client";

import { FileCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ChromeTabsNavigator from "../ChromeTabsNavigator";
import FileManager from "../FileManager";

export default function Tabs() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const onDrop = (acceptedFile: File[]) => {
    if (acceptedFile.length > 0) {
      setSelectedFile(acceptedFile[0]);
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
    },
  });

  return (
    <div>
      <ChromeTabsNavigator />
      <div className="flex flex-col items-center justify-center mt-20">
        {!selectedFile ? (
          <>
            <div
              className="mt-5 w-11/12 md:w-full grid place-items-center max-w-[600px]"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="w-11/12 md:w-full border rounded-lg p-4 border-dashed flex flex-col items-center justify-center h-[200px]">
                <FileCog className="w-8 h-8" />
                <p className="mt-3 cursor-pointer text-center text-sm md:text-base">
                  <span className="text-bold underline">Click here</span> or
                  drag and drop file to get started
                </p>
                <span className="hidden md:block">file must be a .txt</span>
              </div>
            </div>
            <p className="mt-3 text-center text-sm md:text-base">
              Please select / drop the file that the browser extention
              downloaded for you. <br /> Want to learn more?{" "}
              <Link href="/docs/info" className="text-cyan-600" target="_blank">
                click here
              </Link>
            </p>
          </>
        ) : null}
        {selectedFile ? (
          <FileManager
            onError={() => setSelectedFile(undefined)}
            file={selectedFile}
          />
        ) : null}
      </div>
    </div>
  );
}
