import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function getMarkdownPosts() {
  return useQuery({
    queryKey: ["markdownsRepo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get("/api/me/markdown");
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while fetching markdown notes!"
        );
      }
      return toast.error(
        "Something went wrong while fetching markdown notes! Try again later."
      );
    },
  });
}
