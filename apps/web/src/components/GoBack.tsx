"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/markdown")}
      className="inline-flex items-center gap-2"
    >
      <ChevronLeft className="w-5 h-5" />
      <span>Go back</span>
    </button>
  );
}
