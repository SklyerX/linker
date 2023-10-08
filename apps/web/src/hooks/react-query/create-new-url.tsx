import { RedirectUrlCredentials } from "@/lib/validators/redirectUrl";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export default function createNewURL() {
  return useMutation({
    mutationFn: async ({ ...fields }: RedirectUrlCredentials) => {
      const { data } = await axios.post("/api/me/url", { ...fields });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while creating a new url!");
      }
      return toast.error(
        "Something went wrong while creating a new url! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully created url");
    },
  });
}
