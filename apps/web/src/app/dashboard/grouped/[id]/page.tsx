import DashboardLayout from "@/components/layouts/DashboardLayout";
import GroupedSidebar from "@/components/misc/GroupSideBar";
import GroupedLinksWithID from "@/components/pages/groupedLinksWithId";

export default function Page() {
  return (
    <DashboardLayout>
      <GroupedLinksWithID />
    </DashboardLayout>
  );
}
