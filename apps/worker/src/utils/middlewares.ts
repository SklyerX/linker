import { Request, Response, NextFunction } from "express";

import { ZodError } from "zod";
import {
  ExportAccountValidatorBody,
  ExportAccountValidator,
} from "./validators/export-account";

import jwt from "jsonwebtoken";

const validFields = ["links", "groups", "grouped-links", "markdown", "urls"];

export async function isFromTrustedSource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const { data: body_data } = ExportAccountValidatorBody.parse(body);

    const decoded = jwt.verify(body_data, process.env.JWT_SECRET!);

    const data = ExportAccountValidator.parse(decoded);

    for (const item of data.selectedItems) {
      if (!validFields.includes(item))
        return res.status(400).send("Array includes invalid value");
    }

    res.locals.data = data;

    next();
  } catch (err) {
    if (err instanceof ZodError) return res.status(400).send(err);
    res.status(500).send({
      success: false,
      errors: [
        {
          message: err.message,
        },
      ],
    });
  }
}
