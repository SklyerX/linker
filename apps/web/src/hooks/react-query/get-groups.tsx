import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function getGroups() {
  return useQuery({
    queryKey: ["groupsRepo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get("/api/me/group");
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error("Something went wrong while fetching groups!");
      }
      return toast.error(
        "Something went wrong while fetching groups! Try again later."
      );
    },
  });
}
