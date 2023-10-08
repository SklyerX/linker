import { PenSquare } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { GroupCredentials, GroupValidator } from "@/lib/validators/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import createNewGroup from "@/hooks/react-query/create-new-group";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { groupStore } from "@/states/group";

export default function CreateNewGroup() {
  const { setCreated } = groupStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupCredentials>({
    resolver: zodResolver(GroupValidator),
    defaultValues: {
      groupName: "",
    },
  });

  const { mutate, isLoading, isSuccess } = createNewGroup();

  const onSubmit = (data: GroupCredentials) => {
    mutate({ groupName: data.groupName });
  };

  useEffect(() => {
    if (isSuccess) {
      try {
        setCreated(true);
      } catch (err) {
        console.log(err);
        toast.error("Please reload your window!");
      }
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button variant="outline" size="sm" className="w-full">
          <PenSquare className="w-4 h-4 mr-1" />
          <span>New Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
          <DialogDescription>
            create a new group to store your links in
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span className="text-xs mb-1">Group Name</span>
            <Input {...register("groupName")} placeholder="MagicWizard" />
            {errors.groupName ? (
              <span className="text-xs text-red-500">
                {errors.groupName.message}
              </span>
            ) : null}
          </div>
          <DialogFooter className="mt-3">
            <Button type="submit" isLoading={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
