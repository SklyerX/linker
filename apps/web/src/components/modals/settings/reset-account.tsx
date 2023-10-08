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
import resetAccount from "@/hooks/react-query/reset-account";
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

  const { mutate, isLoading, isSuccess } = resetAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountCredentials>({
    resolver: zodResolver(DeleteAccountValidator),
  });

  useEffect(() => {
    if (isSuccess) {
      setOpened(false);
    }
  }, [isSuccess]);

  const onSubmit = (data: DeleteAccountCredentials) => {
    if (data.confirmation !== "reset my account")
      return toast.error("Incorrect confirmation string");
    mutate();
  };

  return (
    <Dialog
      open={opened}
      onOpenChange={(e) => {
        if (isLoading) return;
        setOpened(e);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Reset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset your account</DialogTitle>
          <DialogDescription>
            By reseting your account the following data will be lost for ever.
            This action is not reversible:
            <br />
            Unordered, Links, Grouped, Links, Markdown, Notes, Shortened, URLs,
            Groups, Account, Information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className="text-xs font-semibold mt-2">
            To verify, type reset my account below:
          </span>
          <Input {...register("confirmation")} className="mt-1" />
          <DialogFooter className="mt-5">
            <Button disabled={isLoading} onClick={hideModal} variant="ghost">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              variant="destructive"
            >
              Reset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
