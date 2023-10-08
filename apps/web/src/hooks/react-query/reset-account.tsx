import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export default function resetAccount() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/me/account/reset`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while sending rest request!");
      }
      return toast.error(
        "Something went wrong while sending rest request! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully resetted account");
    },
  });
}
