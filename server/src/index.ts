import "module-alias/register";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { imageCreatorRouter, authRouter } from "@controllers/";
import config from "./config/config";

const app = express();
const port = 8080;
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/image", imageCreatorRouter);

app.listen(port, () => {
  console.log(`Server started at port:${config.server.port}`);
});
