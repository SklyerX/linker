import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import deleteAccount from "@/hooks/react-query/delete-account";
import {
  DeleteAccountCredentials,
  DeleteAccountValidator,
} from "@/lib/validators/delete-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function DeleteAccountModal() {
  const [opened, setOpened] = useState<boolean>(false);

  const hideModal = () => setOpened(false);

  const { mutate, isLoading, isSuccess } = deleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountCredentials>({
    resolver: zodResolver(DeleteAccountValidator),
  });

  const onSubmit = (data: DeleteAccountCredentials) => {
    if (data.confirmation !== "delete my account")
      return toast.error("Incorrect confirmation string");
    mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      setOpened(false);
    }
  }, [isSuccess]);

  return (
    <Dialog
      open={opened}
      onOpenChange={(e) => {
        if (isLoading) return;
        setOpened(e);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account</DialogTitle>
          <DialogDescription>
            By deleting your account the following data will be lost for ever.
            This action is not reversible:
            <br />
            Unordered, Links, Grouped, Links, Markdown, Notes, Shortened, URLs,
            Groups, Account, Information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className="text-xs font-semibold mt-2">
            To verify, type delete my account below:
          </span>
          <Input {...register("confirmation")} className="mt-1" />
          <DialogFooter className="mt-5">
            <Button disabled={isLoading} onClick={hideModal} variant="ghost">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
