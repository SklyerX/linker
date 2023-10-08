import RegularNavbar from "@/components/misc/RegularNavbar";
import Login from "@/components/pages/login";

export default function Page() {
  return (
    <>
      <RegularNavbar />
      <div className="flex-1 mb-10">
        <section
          id="features"
          className="container space-y-6 py-8 md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h3 className="font-semibold text-3xl leading-3 flex-col items-center space-y-4 text-center">
              Welcome / Welcome back!
            </h3>
            <p className="max-w-[82%] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Login to access the dashboard
            </p>
          </div>
        </section>
        <div className="mx-auto md:max-w-[64rem] grid gap-3 place-items-center">
          <Login />
        </div>
      </div>
    </>
  );
}
