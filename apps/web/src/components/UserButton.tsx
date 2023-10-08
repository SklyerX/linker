import { getAuthSession } from "@/lib/auth";
import UserDropdown from "./UserDropdown";

interface Props {
  isDesktop?: boolean;
}

export default async function UserButton({ isDesktop = false }: Props) {
  const session = await getAuthSession();

  return <UserDropdown isDesktop={isDesktop} image={session?.user?.image} />;
}
