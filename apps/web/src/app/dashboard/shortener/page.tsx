import DashboardLayout from "@/components/layouts/DashboardLayout";
import URLShortner from "@/components/pages/url-shortener";

export default function Page() {
  return (
    <DashboardLayout>
      <URLShortner />
    </DashboardLayout>
  );
}
