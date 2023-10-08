import clsx from "clsx";
import { Flame, Info } from "lucide-react";
import MarkdownToJsx from "markdown-to-jsx";

type NoticeProps = {
  title?: string;
  text: string;
  type: "warning" | "info" | "note";
};

export default function Notice({ text, type, title }: NoticeProps) {
  const Icon = type === "warning" ? Flame : Info;

  return (
    <div
      className={clsx(
        "mb-2 rounded border-l-4 border-app-line bg-app-box px-4 py-3",
        type === "note" && "border-yellow-400 bg-yellow-300/20",
        type === "info" && "bg-green-400/20 border-green-400",
        type === "warning" && "border-red-400 bg-red-400/20"
      )}
    >
      <div className="flex flex-row items-center gap-x-1">
        <Icon className="my-0 h-5 w-5 text-foreground" />
        <h5 className="m-0 text-sm font-bold uppercase text-foreground">
          {title || type}
        </h5>
      </div>
      <p className="mx-0 my-1 mb-0 text-foreground">
        <MarkdownToJsx>{text}</MarkdownToJsx>
      </p>
    </div>
  );
}
