import { MarkdownCredentials } from "@/lib/validators/markdown";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function createNewMarkdownPost() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ ...fields }: MarkdownCredentials) => {
      const { data } = await axios.post("/api/me/markdown", { ...fields });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while creating a new markdown post!"
        );
      }
      return toast.error(
        "Something went wrong while creating a new markdown post! Try again later."
      );
    },
    onSuccess: async () => {
      toast.success("Successfully added link");
      router.push("/dashboard/markdown");
    },
  });
}
