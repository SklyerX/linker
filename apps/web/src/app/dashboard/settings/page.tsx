import DashboardLayout from "@/components/layouts/DashboardLayout";
import Settings from "@/components/pages/settings";

export default function Page() {
  return (
    <DashboardLayout centered={true}>
      <Settings />
    </DashboardLayout>
  );
}
