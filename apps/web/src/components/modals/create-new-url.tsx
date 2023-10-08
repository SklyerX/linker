import createNewURL from "@/hooks/react-query/create-new-url";
import {
  RedirectUrlCredentials,
  RedirectUrlValidator,
} from "@/lib/validators/redirectUrl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  DrawerContent,
  DrawerIcon,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useEffect } from "react";

interface Props {
  onChange: () => void;
}

export default function CreateNewURL({ onChange }: Props) {
  const form = useForm<RedirectUrlCredentials>({
    resolver: zodResolver(RedirectUrlValidator),
    defaultValues: {
      active: true,
      redirectUrl: "https://",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutate, isLoading, isSuccess } = createNewURL();

  useEffect(() => {
    if (isSuccess) {
      onChange();
    }
  }, [isSuccess]);

  return (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <Button>Create new URL</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerIcon />
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="container max-w-6xl space-y-1">
            <div className="max-w-lg mx-auto">
              <DrawerTitle>Create new URL</DrawerTitle>
              <p className="text-muted-foreground">Enter your url details.</p>

              <Form {...form}>
                <form
                  className="mt-5"
                  onSubmit={handleSubmit((data) => mutate({ ...data }))}
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
                    <Button isLoading={isLoading}>Create</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DrawerContent>
    </DrawerRoot>
  );
}
