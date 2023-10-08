import { Toaster } from "react-hot-toast";
import DashboardNav from "../misc/DashboardNav";
import clsx from "clsx";

interface Props {
  children: React.ReactNode | React.ReactElement;
  centered?: boolean;
}

export default function DashboardLayout({ children, centered = true }: Props) {
  return (
    <div className="lg:flex">
      <DashboardNav />
      <div
        className={clsx(
          "lg:mt-0 w-full lg:w-[calc(100%-2rem)]",
          centered ? "flex justify-center" : "lg:ml-24"
        )}
      >
        {children}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
