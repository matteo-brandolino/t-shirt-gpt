import "module-alias/register";
import express from "express";
import cors from "cors";
import { imageCreatorRouter } from "@controllers/";

const app = express();
const port = 8080;
app.use(express.json());
app.use(cors());
app.use("/api", imageCreatorRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
