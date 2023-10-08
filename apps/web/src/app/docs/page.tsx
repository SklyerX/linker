import DocsSidebar from "@/components/misc/DocsSidebar";
import RegularNavbar from "@/components/misc/RegularNavbar";
import { allDocs } from "contentlayer/generated";
import { redirect } from "next/navigation";
export default async function Page() {
  redirect("/docs/getting-started/introduction");
  return (
    <>
      <RegularNavbar />
    </>
  );
}
