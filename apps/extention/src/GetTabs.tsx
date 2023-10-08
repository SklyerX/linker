import { getTabsAndDownloadStringEncryptedData } from "./utils/chrome";

export default function GetTabs() {
  return (
    <div className="my-3 p-3">
      <p className="text-xs text-center">
        This proccess may take some time depending on your download speed /
        computer power
      </p>
      <button
        onClick={getTabsAndDownloadStringEncryptedData}
        className="mt-3 w-full border border-[#272727] rounded-md px-4 py-2 hover:bg-[#272727] transition-colors"
      >
        start process
      </button>
    </div>
  );
}
