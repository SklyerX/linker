import { GroupCredentials } from "@/lib/validators/group";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export default function createNewGroup() {
  return useMutation({
    mutationFn: async ({ ...fields }: GroupCredentials) => {
      const { data } = await axios.post("/api/me/group", { ...fields });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while creating a new group!");
      }
      return toast.error(
        "Something went wrong while creating a new group! Try again later."
      );
    },
    onSuccess: () => {
      toast.success("Successfully created group");
    },
  });
}
