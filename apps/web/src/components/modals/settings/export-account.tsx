import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import exportAccount from "@/hooks/react-query/export-account";
import {
  ExportAccountCredentials,
  ExportAccountValidator,
} from "@/lib/validators/export-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const items = [
  {
    id: "links",
    label: "Links",
  },
  {
    id: "grouped-links",
    label: "Grouped Links",
  },
  {
    id: "groups",
    label: "Groups",
  },
  {
    id: "urls",
    label: "Urls",
  },
  {
    id: "markdown",
    label: "Markdown",
  },
] as const;

export default function ExportAccountModal() {
  const form = useForm<ExportAccountCredentials>({
    resolver: zodResolver(ExportAccountValidator),
    defaultValues: {
      items: ["links"],
    },
  });

  const [opened, setOpened] = useState<boolean>(false);

  const { mutate, isLoading } = exportAccount();

  return (
    <Dialog
      open={opened}
      onOpenChange={(e) => {
        if (isLoading)
          return toast.error("Please wait... Your data is being exported.");
        setOpened(e);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Export</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export account settings</DialogTitle>
          <DialogDescription className="text-foreground/60">
            You can export your account details. They will be emailed to you
            once they are ready. This{" "}
            <strong className="text-foreground">
              process may take a couple of hours
            </strong>{" "}
            depending on the data that you have. Please be patient. you can only
            submit <strong className="text-foreground">one</strong> request per
            day! (after being resolved)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate({ ...data }))}>
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Exporting Data</FormLabel>
                    <FormDescription>
                      Select the items you'd like to export
                    </FormDescription>
                  </div>
                  {items.map((item, index) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full h-[1px] bg-input my-5"></div>
            <DialogFooter>
              <Button type="submit" isLoading={isLoading}>
                Export Data
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
