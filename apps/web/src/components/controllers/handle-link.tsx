import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import deleteGroupLink from "@/hooks/react-query/delete-group-link";
import deleteLink from "@/hooks/react-query/delete-link";
import { useLinkStore } from "@/states/link-item";
import { Link } from "@/types";
import { Check, Loader2, MoreVertical, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  link: Link;
  isGroup?: boolean;
}

export default function HandleLink({ link, isGroup }: Props) {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  const { setActions } = useLinkStore();

  const { mutate, isLoading, isSuccess } = deleteLink();
  const {
    mutate: mutateGroup,
    isLoading: isLoadingGroup,
    isSuccess: isSuccessGroup,
  } = deleteGroupLink();

  const handleDelete = () => {
    if (isGroup) {
      mutateGroup({ id: link.id });
    } else {
      mutate({ id: link.id });
    }
  };

  useEffect(() => {
    if (isSuccess || isSuccessGroup) {
      setActions("linkitem/delete", link);
      setIsDelete(false);
      setOpened(false);
    }
  }, [isSuccess, isSuccessGroup]);

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
            <div className="flex w-full items-center justify-between">
              <span>Sure?</span>
              {isLoading || isLoadingGroup ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="inline-flex gap-1">
                  <button
                    onClick={handleDelete}
                    className="p-0.5 bg-red-500/80 rounded-md"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsDelete(false);
                      setOpened(false);
                    }}
                    className="p-0.5 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="cursor-pointer inline-flex items-center gap-2"
              onClick={() => setIsDelete(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
