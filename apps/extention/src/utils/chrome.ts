import { encrypt } from "./crypto";
import { v4 as uuid } from "uuid";

interface TabsArray {
  id: string;
  icon: string;
  title: string;
  url: string;
}

export const downloadFile = (data: string, name: string) => {
  const blob = new Blob([data], {
    type: "text/plain",
  });

  const blobUrl = URL.createObjectURL(blob);

  // @ts-ignore
  chrome.downloads.download(
    {
      url: blobUrl,
      filename: `${name}.txt`,
    },
    function (downloadId: string) {
      console.log("Download initiated with ID: " + downloadId);
    }
  );
};

export const getTabsAndDownloadStringEncryptedData = () => {
  // @ts-ignore
  chrome.windows.getAll({ populate: true }, getAllOpenWindows);
};

export const getBookmarksAndDownloadStringEncryptedData = () => {
  // @ts-ignore
  chrome.bookmarks.getTree(function (bookmarkTreeNode) {
    const encrypted = encrypt(JSON.stringify(bookmarkTreeNode));

    downloadFile(encrypted, "downloaded-bookmarks");
  });
};

function getAllOpenWindows(winData: any) {
  var tabs: TabsArray[] = [];

  winData.map((data: any) => {
    for (const tab of data.tabs) {
      tabs.push({
        id: uuid(),
        icon: tab.favIconUrl,
        title: tab.title,
        url: tab.url,
      });
    }
  });

  const encrypted = encrypt(JSON.stringify(tabs));

  downloadFile(encrypted, "downloaded-tabs");
}
