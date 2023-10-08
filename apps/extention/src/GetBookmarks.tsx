import { getBookmarksAndDownloadStringEncryptedData } from "./utils/chrome";

export default function GetBookmarks() {
  return (
    <div className="my-3 p-3">
      <button
        onClick={getBookmarksAndDownloadStringEncryptedData}
        className="mt-3 w-full border border-[#272727] rounded-md px-4 py-2 hover:bg-[#272727] transition-colors"
      >
        start process
      </button>
    </div>
  );
}
