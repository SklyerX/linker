import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getGroupLinks() {
  const params = useParams();
  const router = useRouter();

  return useQuery({
    queryKey: ["groupLinksxRepo"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/me/group/${params.id}`);
      return data;
    },
    onError: (err) => {
      console.log(err);
      router.replace("/dashboard/grouped");
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          router.replace("/dashboard/grouped");
        }

        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while fetching links!");
      }
      toast.error(
        "Something went wrong while fetching links! Please try again later."
      );
    },
  });
}
