import updateURL from "@/hooks/react-query/update-url";
import {
  RedirectUrlCredentials,
  RedirectUrlValidator,
} from "@/lib/validators/redirectUrl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Url } from "@prisma/client";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import HandleURL from "./controllers/handle-url";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Switch } from "./ui/switch";
import { useLinkStore } from "@/states/link-item";
import { useEffect } from "react";

interface Props {
  url: Url;
}

const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("copied");
};

export default function URLItem({ url }: Props) {
  const { setActions } = useLinkStore();

  const form = useForm<RedirectUrlCredentials>({
    resolver: zodResolver(RedirectUrlValidator),
    defaultValues: {
      active: url.active,
      redirectUrl: url.redirectUrl,
      title: url.title,
    },
  });

  const { isLoading, mutate, isSuccess } = updateURL();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (isSuccess) {
      setActions("linkitem/update", { ...url, ...getValues() });
    }
  }, [isSuccess]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="w-full flex items-center mb-2 justify-between border rounded-md p-4 drop-shadow-sm">
          <div>
            <h3 className="font-semibold text-xl">{url.title}</h3>
            <p className="text-sm">
              {url.redirectUrl.length > 45
                ? url.redirectUrl.substring(0, 45) + "..."
                : url.redirectUrl}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/api/r/${url.urlId}`} target="_blank">
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Copy
              className="w-4 h-4 cursor-pointer"
              onClick={() =>
                copyText(`http://localhost:3000/api/r/${url.urlId}`)
              }
            />
            <HandleURL
              id={url.id}
              onChange={() => setActions("linkitem/delete", { ...url })}
            />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Shortened URL</SheetTitle>
          <SheetDescription>
            To modify this url, make your changes then press Save
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="mt-5"
            onSubmit={handleSubmit((data) => mutate({ ...url, ...data }))}
          >
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
              <Input {...register("redirectUrl")} />
              {errors.redirectUrl ? (
                <span className="text-xs text-red-500 my-2">
                  {errors.redirectUrl.message}
                </span>
              ) : null}
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center mt-4 justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Allow people to use this url
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-5">
              <Button isLoading={isLoading}>Save</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
