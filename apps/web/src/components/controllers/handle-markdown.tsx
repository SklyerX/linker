import { Check, Loader2, MoreVertical, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import deleteMarkdown from "@/hooks/react-query/delete-markdown";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function HandleMarkdown({ id }: Props) {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  const router = useRouter();

  const { mutate, isLoading, isSuccess } = deleteMarkdown();

  useEffect(() => {
    if (isSuccess) {
      setOpened(false);
      router.push("/dashboard/markdown");
    }
  }, [isSuccess]);

  return (
    <DropdownMenu
      open={opened}
      onOpenChange={(e) => {
        if (!e) setIsDelete(false);
        setOpened(e);
      }}
    >
      <DropdownMenuTrigger>
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setIsDelete(true);
          }}
        >
          {isDelete ? (
            <div className="w-full flex items-center justify-between">
              <span>Sure?</span>
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <div className="flex gap-1">
                  <div className="p-0.5 bg-red-500 rounded-md cursor-pointer">
                    <Check className="w-4 h-4" onClick={() => mutate({ id })} />
                  </div>
                  <div className="p-0.5 rounded-md cursor-pointer">
                    <X className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete post</span>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
