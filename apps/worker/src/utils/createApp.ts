import type { Express } from "express";
import express from "express";

import { config } from "dotenv";

config();

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  return app;
}
