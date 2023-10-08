import { LinkCredentials, TabsGroupCredentials } from "@/lib/validators/link";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function createTabs() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ ...fields }: TabsGroupCredentials) => {
      const { data } = await axios.post("/api/me/group/bulk", { ...fields });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while adding tabs to a group!"
        );
      }
      return toast.error(
        "Something went wrong while adding tabs to a group! Try again later."
      );
    },
    onSuccess: (data) => {
      toast.success("Successfully added link");
      router.push(`/dashboard/grouped/${data.id}`);
    },
  });
}
