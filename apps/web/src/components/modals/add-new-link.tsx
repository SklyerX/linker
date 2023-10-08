import { Button } from "../ui/button";
import { Input } from "../ui/input";

import addNewLink from "@/hooks/react-query/create-new-link";
import { LinkCredentialsForm, LinkValidatorForm } from "@/lib/validators/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  DrawerContent,
  DrawerIcon,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Textarea } from "../ui/textarea";

interface Props {
  onChange: () => void;
}

export default function AddNewLink({ onChange }: Props) {
  const { mutate: addLink, isLoading, isSuccess } = addNewLink();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<LinkCredentialsForm>({
    resolver: zodResolver(LinkValidatorForm),
  });

  const onSubmit = (data: LinkCredentialsForm) => {
    addLink(data);
  };

  useEffect(() => {
    if (isSuccess) {
      onChange();
      reset();
    }
  }, [isSuccess]);

  return (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <Button>Add link</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerIcon />
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="container max-w-6xl space-y-1">
            <div className="max-w-lg mx-auto">
              <DrawerTitle>Add new link</DrawerTitle>
              <p className="text-muted-foreground">Enter your link details.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                <div>
                  <span className="text-xs">Title</span>
                  <Input {...register("title")} />
                  {errors.title ? (
                    <span className="text-xs text-red-500 my-2">
                      {errors.title.message}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3">
                  <span className="text-xs">URL</span>
                  <Input {...register("url")} />
                  {errors.url ? (
                    <span className="text-xs text-red-500 my-2">
                      {errors.url.message}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3">
                  <span className="text-xs">Description</span>
                  <Textarea rows={5} {...register("description")} />
                  {errors.description ? (
                    <span className="text-xs text-red-500 my-2">
                      {errors.description.message}
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button isLoading={isLoading} type="submit">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DrawerContent>
    </DrawerRoot>
  );
}
