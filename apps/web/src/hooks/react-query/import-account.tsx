import { ImportAccountCredentials } from "@/lib/validators/import-account";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function importAccount() {
  return useMutation({
    mutationFn: async ({ ...fields }: ImportAccountCredentials) => {
      const { data } = await axios.post("/api/me/account/import", {
        ...fields,
      });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while importing account!");
      }
      return toast.error(
        "Something went wrong while importing account! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully imported data into your account.");
    },
  });
}
