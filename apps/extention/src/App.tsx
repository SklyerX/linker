import clsx from "clsx";
import { useState } from "react";
import "./index.css";
import GetTabs from "./GetTabs";
import GetBookmarks from "./GetBookmarks";

export default function App() {
  const [tab, setTab] = useState<number>(0);

  return (
    <>
      <div className="w-full h-10 border-b border-[#999] flex items-stretch px-2 gap-10 cursor-pointer">
        <button
          onClick={() => setTab(0)}
          className={clsx("h-10", tab === 0 ? "border-b-2 border-white" : null)}
        >
          My Tabs
        </button>
        <button
          onClick={() => setTab(1)}
          className={clsx("h-10", tab === 1 ? "border-b-2 border-white" : null)}
        >
          My Bookmarks
        </button>
      </div>
      {tab === 0 ? <GetTabs /> : <GetBookmarks />}
    </>
  );
}
