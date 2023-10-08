"use client";

import { uploadFiles } from "@/lib/uploadthing";
import {
  MarkdownCredentialsForm,
  MarkdownValidatorForm,
} from "@/lib/validators/markdown";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";
import createNewMarkdownPost from "@/hooks/react-query/create-new-markdown-post";
import { Markdown } from "@/types";
import editMarkdownPost from "@/hooks/react-query/edit-markdown-content";
import HandleMarkdown from "../controllers/handle-markdown";
import GoBack from "../GoBack";

interface Props {
  post?: Markdown;
  update?: boolean;
}

export default function CreateNewNote({ post, update }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MarkdownCredentialsForm>({
    resolver: zodResolver(MarkdownValidatorForm),
    defaultValues: {
      content: null,
      title: post?.title ? post?.title : "",
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  // @ts-ignore
  let titleRef$ = useRef<HTMLTextAreaElement>(null);

  const initializeEditor = useCallback(async () => {
    const EditorJs = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;

    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJs({
        autofocus: false,
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your note...",
        inlineToolbar: true,
        data: {
          blocks: post?.content ? post?.content.blocks : [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/metadata",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    endpoint: "imageUploader",
                    files: [file],
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast.error((value as { message: string }).message);
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        titleRef$.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: createPost, isLoading } = createNewMarkdownPost();
  const { mutate: editPost, isLoading: isEditting } = editMarkdownPost();

  async function onSubmit(data: MarkdownCredentialsForm) {
    const blocks = await ref.current?.save();

    const payload = {
      title: data.title,
      content: blocks,
    };

    if (update) {
      editPost({ ...payload, id: post?.id as string });
    } else {
      createPost(payload);
    }
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="flex justify-center flex-col w-11/12">
      <div className="w-full flex items-center justify-between">
        <Button
          isLoading={isLoading || isEditting}
          form="post-form"
          className="mt-5 w-fit"
        >
          {update ? "Update" : "Create"}
        </Button>
        {post ? <HandleMarkdown id={post.id} /> : <GoBack />}
      </div>
      <div className="w-full p-4 bg-background/50 rounded-lg border border-input mt-5">
        <form id="post-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize
              autoFocus
              ref={(e) => {
                titleRef(e);

                // @ts-ignore
                titleRef$ = e;
              }}
              {...rest}
              placeholder="Title"
              className="w-full resize-none appearance-none text-foreground overflow-hidden bg-transparent text-4xl font-bold focus:outline-none"
            />
            <div id="editor" className="min-h-[500px] text-foreground" />
          </div>
        </form>
      </div>
    </div>
  );
}
