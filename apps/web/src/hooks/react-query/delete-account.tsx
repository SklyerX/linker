import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function deleteAccount() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/me/account/delete`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while deleting your account!");
      }
      return toast.error(
        "Something went wrong while deleting your account! Try again later."
      );
    },
    onSuccess: () => {
      router.push("/");
    },
  });
}
