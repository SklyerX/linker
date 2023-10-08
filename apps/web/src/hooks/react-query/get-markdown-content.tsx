import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function getMarkdownContent() {
  const params = useParams();

  return useQuery({
    queryKey: ["markdownContentRepo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`/api/me/markdown/${params.id}`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while fetching markdown content"
        );
      }
      return toast.error(
        "Something went wrong while fetching markdown content Try again later."
      );
    },
  });
}
