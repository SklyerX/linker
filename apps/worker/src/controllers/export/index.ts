import { Request, Response } from "express";
import { prisma } from "../../database/index";
import { ExportAccountCredentials } from "@/utils/validators/export-account";

export async function exportAccount(req: Request, res: Response) {
  const data = res.locals.data as ExportAccountCredentials;

  await prisma.exportQueue.create({
    data: {
      userId: data.userId,
      fileKey: null,
      status: "WAITING",
      selectedItems: data.selectedItems,
      createdAt: data.initiatedOn,
      updatedAt: new Date(),
    },
  });

  res.status(201).send({ message: "created" });
}
