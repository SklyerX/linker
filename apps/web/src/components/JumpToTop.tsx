import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function getWindow(): (Window & typeof globalThis) | null {
  return typeof window !== "undefined" ? window : null;
}

export default function JumpToTop() {
  const [isAtTop, setIsAtTop] = useState<boolean>(true);

  function onScroll() {
    if ((getWindow()?.pageYOffset || 0) < 20) setIsAtTop(true);
    else if (isAtTop) setIsAtTop(false);
  }

  useEffect(() => {
    if (!window) return;
    setTimeout(onScroll, 0);
    getWindow()?.addEventListener("scroll", onScroll);
    return () => getWindow()?.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isAtTop ? (
        <div
          className="p-2 fixed bottom-3 left-3 border grid place-items-center rounded-full w-10 h-10 bg-background/50 backdrop-blur-xl"
          onClick={() =>
            window.scroll({
              left: 0,
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <ChevronUp className="w-5 h-5" />
        </div>
      ) : null}
    </>
  );
}
