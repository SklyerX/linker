import GroupedSidebar from "../misc/GroupSideBar";

export default function GroupLinks() {
  return (
    <div className="lg:flex h-screen items-center justify-center">
      <GroupedSidebar />
      <div className="w-full flex items-center justify-center mt-20 lg:mt-0">
        <div className="rounded-md border drop-shadow-sm max-w-[400px] p-3">
          <h3 className="font-semibold text-lg">Group Editor</h3>
          <p className="text-foreground/80 text-sm">
            select a group from the{" "}
            <span className="lg:hidden">group sidebar</span>
            <span className="hidden lg:block">
              navigation panel on the left
            </span>{" "}
            to view it's data, or create a new group
          </p>
        </div>
      </div>
    </div>
  );
}
