import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CryptoJS from "crypto-js";
import { FileCog, FileSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import jwt from "jsonwebtoken";
import clsx from "clsx";
import importAccount from "@/hooks/react-query/import-account";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function ImportAccountModal() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState({});
  const [progress, setProgress] = useState<
    "WAITING" | "PARSING" | "VALIDATING" | "READY"
  >("WAITING");

  const onDrop = (acceptedFile: File[]) => {
    if (acceptedFile.length > 0) {
      setSelectedFile(acceptedFile[0]);
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/json": [".json"],
    },
  });

  useEffect(() => {
    if (selectedFile) {
      setProgress("PARSING");
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (e) => {
        try {
          setProgress("VALIDATING");
          const text = e.target?.result as string;

          const jsonParsedText = JSON.parse(text);

          const decryptedData = CryptoJS.AES.decrypt(
            jsonParsedText.data,
            "YourSecretKey"
          ).toString(CryptoJS.enc.Utf8);

          const parsedData = JSON.parse(decryptedData);

          console.log(parsedData);

          // just a simple JWT verification to see if the data given is from our servers (easier validation);
          const name = jwt.verify(parsedData.signature, "YourSecretKey");

          console.log(name);

          setData(parsedData);
          setProgress("READY");
        } catch (err) {
          setSelectedFile(undefined);
          console.error(err);
          toast.error(
            (err as { message: string }).message ||
              "Something went wrong while reading the document"
          );
        }
      };
    }
  }, [selectedFile]);

  const { isLoading, mutate } = importAccount();

  const handleImport = () => {
    if (!selectedFile) return toast.error("You must select a file first.");
    if (value !== "import into my account")
      return toast.error("Please confirm your choice!");
    mutate({ ...data });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Import</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import</DialogTitle>
          <DialogDescription>
            Import the exported file that was given to you via email.
          </DialogDescription>
        </DialogHeader>
        <div
          className={clsx(
            "my-3 mb-1 w-full h-[150px] rounded-md flex flex-col items-center justify-center border",
            selectedFile ? "border-dotted" : "border-dashed"
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {!selectedFile ? (
            <div className="flex items-center flex-col">
              <FileCog className="w-8 h-8" />
              <p className="mt-3 cursor-pointer text-center text-sm md:text-base">
                <span className="text-bold underline">Click here</span> or drag
                and drop file to get started
              </p>
              <span className="hidden md:block">file must be a .txt</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="p-2 border rounded-md">
                <FileSearch className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Validating file / Parsing data</h3>
                <p className="text-sm">Current status: {progress}</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <span className="text-sm">
            type <strong>import into my account</strong> below:
          </span>
          <Input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
          <span className="text-xs leading-2">
            All your account data will be deleted and replace with the contents
            of this file
          </span>
        </div>
        <DialogFooter>
          <Button onClick={handleImport} isLoading={isLoading}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
