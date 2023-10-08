import { LinkCredentials } from "@/lib/validators/link";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface Props extends LinkCredentials {
  id: string;
}

export default function addNewGroupLink() {
  return useMutation({
    mutationFn: async ({ id, ...fields }: Props) => {
      const { data } = await axios.post(`/api/me/group/link/${id}`, {
        ...fields,
      });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (
          (typeof err.response?.data.message === "string" &&
            err.response?.data.message.startsWith("Hostname/IP")) ||
          err.response?.data.message.startsWith("getaddrinfo ENOTFOUND")
        )
          return toast.error("Invalid URL provided");

        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while adding a new group link!"
        );
      }
      return toast.error(
        "Something went wrong while adding a new group link! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully added link");
    },
  });
}
