import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface Props {
  id: string;
}

export default function deleteGroupLink() {
  return useMutation({
    mutationFn: async ({ id }: Props) => {
      const { data } = await axios.delete(`/api/me/group/link/${id}`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while deleting link!");
      }
      return toast.error(
        "Something went wrong while deleting link! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully deleted link");
    },
  });
}
