"use client";

import DeleteAccountModal from "@/components/modals/settings/delete-account";
import ExportAccountModal from "@/components/modals/settings/export-account";
import ImportAccountModal from "@/components/modals/settings/import-account";
import ResetAccountModal from "@/components/modals/settings/reset-account";
import { useEffect, useState } from "react";

import clsx from "clsx";
import themes from "../../../public/themes.json";

type theme = keyof typeof themes;

export default function Settings() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setTheme = (name: theme) => {
    for (const [key, value] of Object.entries(themes[name])) {
      document.body.style.setProperty(key, value);
      window.localStorage.setItem("theme", name);
    }
  };

  return (
    <>
      {mounted ? (
        <div className="mt-3 lg:p-0 p-5 mb-10">
          <h3 className="text-xl font-semibold">Settings</h3>
          <div className="w-full mt-5">
            <div>
              <h3 className="text-lg font-medium">Import & Export</h3>
              <div className="mt-3 flex flex-col gap-2">
                <ImportAccountModal />
                <ExportAccountModal />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-medium">Themes</h3>
              <div className="mt-2">
                {Object.entries(themes).map(([key, value], index) => (
                  <div
                    className={clsx(
                      "flex items-center mb-1 justify-between cursor-pointer"
                      // key === selectedTheme ? "border rounded-md p-1" : null
                    )}
                    onClick={() => setTheme(key as theme)}
                    key={index}
                  >
                    <p>{key}</p>
                    <div className="px-2 py-1 rounded-md flex gap-1 bg-zinc-300">
                      <div
                        className="w-2 h-2 p-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${value["--background"]})`,
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 p-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${value["--primary"]})`,
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 p-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${value["--secondary"]})`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-medium">Danger Zone</h3>
              <div className="mt-5 p-4 border max-w-[800px] rounded-md border-red-500">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">Reset Account</h4>
                      <p className="text-sm">
                        Reset all information and start clean
                      </p>
                    </div>
                    <ResetAccountModal />
                  </div>
                  <div className="flex items-center mt-3 justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">Delete Account</h4>
                      <p className="text-sm w-10/12">
                        Once you delete an account, there is no going back.
                        Please be certain.
                      </p>
                    </div>
                    <DeleteAccountModal />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
