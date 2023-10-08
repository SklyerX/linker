import { useLinkStore } from "@/states/link-item";
import { Link as LinkType } from "@/types";
import { ExternalLink, MoreVertical } from "lucide-react";
import HandleLink from "./controllers/handle-link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LinkCredentialsForm, LinkValidatorForm } from "@/lib/validators/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import editLink from "@/hooks/react-query/edit-link";
import editGroupLink from "@/hooks/react-query/edit-group-link";
import { useEffect } from "react";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
// import Link from "next/link";

interface Props {
  link: LinkType;
  isGroup?: boolean;
}

export default function LinkItem({ link, isGroup = false }: Props) {
  const { setActions } = useLinkStore();

  const { mutate: updateLink, isLoading, isSuccess } = editLink();
  const {
    mutate: updateGroupLink,
    isLoading: isLoadingGroup,
    isSuccess: isSuccessGroup,
  } = editGroupLink();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<LinkCredentialsForm>({
    resolver: zodResolver(LinkValidatorForm),
    defaultValues: {
      description: link.description,
      title: link.title,
      url: link.url,
    },
  });

  const onSubmit = (data: LinkCredentialsForm) => {
    if (isGroup) {
      updateGroupLink({
        url: data.url,
        description: data.description,
        title: data.title,
        id: link.id,
      });
    } else {
      updateLink({
        url: data.url,
        description: data.description,
        title: data.title,
        id: link.id,
      });
    }
  };

  useEffect(() => {
    if (isSuccess || isSuccessGroup) {
      setActions("linkitem/update", {
        ...link,
        title: getValues().title as string,
        url: getValues().url,
      });
    }
  }, [isSuccess, isSuccessGroup]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between border-b py-2">
          <div className="flex items-center gap-2">
            <img
              src={
                link.image.startsWith("/") ? link.url + link.image : link.image
              }
              className="w-10 h-10 rounded-md object-cover"
            />
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">
                {link.title.length > 42
                  ? link.title.substring(0, 42) + "..."
                  : link.title}
              </h3>
              <p>
                {link.url.length > 62
                  ? link.url.substring(0, 62) + "..."
                  : link.url}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Link href={link.url} target="_blank">
              <ExternalLink className="w-4 h-4" />
            </Link>
            <HandleLink link={link} isGroup={isGroup} />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editing Link</SheetTitle>
          <SheetDescription>
            Any changes you make will be reflected on this link and saved in the
            database
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div>
            <span className="text-xs">URL</span>
            <Input {...register("url")} />
            {errors.url ? (
              <span className="text-xs text-red-500 my-1 5">
                {errors.url.message}
              </span>
            ) : null}
          </div>
          <div>
            <span className="text-xs">Title</span>
            <Input {...register("title")} />
            {errors.title ? (
              <span className="text-xs text-red-500 my-1 5">
                {errors.title.message}
              </span>
            ) : null}
          </div>
          <div>
            <span className="text-xs">Description</span>
            <Textarea {...register("description")} />
            {errors.description ? (
              <span className="text-xs text-red-500 my-1 5">
                {errors.description.message}
              </span>
            ) : null}
          </div>
          <div>
            <span className="text-xs">Image</span>
            <Input value={link.image} disabled />
          </div>
          <Button
            isLoading={isLoading || isLoadingGroup}
            type="submit"
            className="mt-3 w-full"
          >
            Update
          </Button>
          <div className="mt-4 ml-1">
            <p className="text-xs">
              Created:{" "}
              <strong>
                {formatDistanceToNowStrict(
                  new Date(link?.createdAt || new Date()),
                  {
                    addSuffix: true,
                  }
                )}
              </strong>
            </p>
            <p className="text-xs">
              Updated:{" "}
              <strong>
                {formatDistanceToNowStrict(
                  new Date(link?.updatedAt || new Date()),
                  {
                    addSuffix: true,
                  }
                )}
              </strong>
            </p>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
