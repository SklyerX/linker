import { MarkdownCredentials } from "@/lib/validators/markdown";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Props extends MarkdownCredentials {
  id: string;
}

export default function editMarkdownPost() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, ...fields }: Props) => {
      const { data } = await axios.patch(`/api/me/markdown/${id}`, {
        ...fields,
      });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while updating markdown post!"
        );
      }
      return toast.error(
        "Something went wrong while updating markdown post! Try again later."
      );
    },
    onSuccess: async () => {
      toast.success("Successfully updated link");
      router.push("/dashboard/markdown");
    },
  });
}
