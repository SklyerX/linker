import { LinkCredentials } from "@/lib/validators/link";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface Props extends LinkCredentials {
  id: string;
}

export default function editLink() {
  return useMutation({
    mutationFn: async ({ id, ...fields }: Props) => {
      const { data } = await axios.patch(`/api/me/link/${id}`, { ...fields });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while updating link!");
      }
      return toast.error(
        "Something went wrong while updating link! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully updated link");
    },
  });
}
