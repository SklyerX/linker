import DashboardLayout from "@/components/layouts/DashboardLayout";
import UnorderedLinksRenderer from "@/components/pages/unordered-links";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <UnorderedLinksRenderer />
    </DashboardLayout>
  );
}
