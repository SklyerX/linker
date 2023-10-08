import { ExportAccountCredentials } from "@/lib/validators/export-account";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export default function exportAccount() {
  return useMutation({
    mutationFn: async ({ ...fields }: ExportAccountCredentials) => {
      const { data } = await axios.post("/api/me/account/export", {
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
          "Something went wrong while sending export request!"
        );
      }
      return toast.error(
        "Something went wrong while sending export request! Try again later."
      );
    },
    onSuccess: (data) => {
      toast.success("Successfully requested export.");
    },
  });
}
