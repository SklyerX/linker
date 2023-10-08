import { prisma } from "../database";
import { delay } from "../utils/functions";
import chalk from "chalk";
import { Resend } from "resend";

import CryptoJS from "crypto-js";
import ExportedAccountDetails from "..//emails/ExportedAccountDetails";
import { utapi } from "../uploadthing";

import jwt from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_SECRET);

export default async () => {
  let status = "nojob";
  await delay(10 * 1000);
  while (true) {
    if (status === "nojob") {
      console.log(`line 17 (status: ${status})`);
      const data = await prisma.exportQueue.findFirst({
        where: {
          OR: [
            {
              status: "IN_PROGRESS",
            },
            {
              status: "WAITING",
            },
          ],
        },
        orderBy: {
          id: "asc",
        },
      });

      console.log(`Data Found`, data);

      if (!data) {
        console.log(`Data not found (status: ${status})`);
        status = "nojob";
        await delay(60 * 1000);
        continue;
      }

      const doc = await prisma.exportQueue.update({
        where: {
          id: data.id,
        },
        data: {
          status: "IN_PROGRESS",
          updatedAt: new Date(),
        },
      });

      const user = await prisma.user.findFirst({
        where: {
          id: doc.userId,
        },
        select: {
          Links: doc.selectedItems.includes("links"),
          Markdowns: doc.selectedItems.includes("markdown"),
          Urls: doc.selectedItems.includes("urls"),
          GroupedLinks: doc.selectedItems.includes("grouped-links"),
          Groups: doc.selectedItems.includes("groups"),
          email: true,
          name: true,
        },
      });

      console.log(
        `${chalk.blue("INFO")} ${chalk.gray(
          "services:accountExporter.ts"
        )} Exporting account credentials`
      );

      const signature = jwt.sign(user.name, "YourSecretKey");

      const document = {
        ...user,
        signature,
      };

      const dataToEncrypt = JSON.stringify(document);

      const encryptedData = CryptoJS.AES.encrypt(
        dataToEncrypt,
        process.env.ENCRYPTION_KEY!
      ).toString();

      const blob = new Blob(
        [
          JSON.stringify({
            data: encryptedData,
          }),
        ],
        {
          type: "application/json",
        }
      );
      const file = Object.assign(blob, { name: `exported-account.json` });

      const [res] = await utapi.uploadFiles([file], {
        "Content-Disposition": "attachment; filename=exported-account.json",
      });

      await prisma.exportQueue.update({
        where: {
          id: doc.id,
        },
        data: {
          fileKey: res.data.key,
          updatedAt: new Date(),
          status: "FINISHED",
        },
      });

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Account Export Completed",
        react: ExportedAccountDetails({
          username: user.name,
          downloadURL: res.data.url,
        }),
      });

      status = "nojob";
      console.log(`line 98 (status: ${status})`);
    }
    await delay(60 * 1000);
    console.log(
      `${chalk.blue("INFO")} ${chalk.gray(
        "services:accountExporter.ts"
      )} Line 104 Executed`
    );
  }
};
