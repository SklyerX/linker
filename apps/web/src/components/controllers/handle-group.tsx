import {
  Check,
  Copy,
  Loader2,
  MoreHorizontal,
  PenSquare,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";

import deleteGroup from "@/hooks/react-query/delete-group";

interface Props {
  id: string;
  onChange: () => void;
}

export default function HandleGroup({ id, onChange }: Props) {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  const { mutate, isLoading, isSuccess } = deleteGroup();

  useEffect(() => {
    if (isSuccess) {
      setOpened(false);
      onChange();
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
        <MoreHorizontal className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
          <div className="inline-flex items-center gap-2">
            <PenSquare className="w-4 h-4" />
            <span>Edit group</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
          <div className="inline-flex items-center gap-2">
            <Copy className="w-4 h-4" />
            <span>Duplicate group</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
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
                  <div className="p-1 bg-red-500 rounded-md cursor-pointer">
                    <Check className="w-4 h-4" onClick={() => mutate({ id })} />
                  </div>
                  <div className="p-1 rounded-md cursor-pointer">
                    <X className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete group</span>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
