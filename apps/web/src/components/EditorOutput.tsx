"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { Cutive_Mono } from "next/font/google";

const cutive_mono = Cutive_Mono({ subsets: ["latin"], weight: ["400"] });

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.2rem",
  },
};

const renderers = {
  code: CustomCodeRenderer,
};

export default function EditorOutput({ content }: EditorOutputProps) {
  return (
    <Output
      style={style}
      data={content}
      className="text-sm"
      renderers={renderers}
    />
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre
      className={clsx(
        "bg-background/50 border font-mono rounded-md p-4",
        cutive_mono.className
      )}
    >
      <code className="text-foreground text-sm">{data.code}</code>
    </pre>
  );
}
