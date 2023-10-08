import createTabs from "@/hooks/react-query/create-tabs";
import { GroupCredentials, GroupValidator } from "@/lib/validators/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Tab } from "@/types";

interface Props {
  tabs: Array<Tab>;
}

export default function SaveTabs({ tabs }: Props) {
  const [opened, setOpened] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<GroupCredentials>({
    resolver: zodResolver(GroupValidator),
  });

  const { mutate, isLoading } = createTabs();

  return (
    <Dialog
      open={opened}
      onOpenChange={(e) => {
        if (isLoading) return;
        setOpened(e);
      }}
    >
      <DialogTrigger asChild>
        <Button>Save Tabs</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save tabs</DialogTitle>
          <DialogDescription>
            Save all your gathered tabs to their specific folder. Just in case
            you need them ;)
          </DialogDescription>
          <form
            onSubmit={handleSubmit((data) =>
              mutate({ groupName: data.groupName, links: tabs })
            )}
          >
            <div className="mb-3">
              <span className="text-xs">Group Name</span>
              <Input {...register("groupName")} />
              {errors.groupName ? (
                <span className="text-red-500 !my-2">
                  {errors.groupName?.message}
                </span>
              ) : null}
            </div>
            <DialogFooter className="!mt-5">
              <Button isLoading={isLoading}>Create & Save</Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
