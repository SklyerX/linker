import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Url } from "database";
import toast from "react-hot-toast";

export default function updateURL() {
  return useMutation({
    mutationFn: async ({ id, active, ...fields }: Url) => {
      const { data } = await axios.patch(`/api/me/url/${id}`, {
        id,
        active,
        ...fields,
      });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while updating url!");
      }
      return toast.error(
        "Something went wrong while updating url! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully updated url");
    },
  });
}
