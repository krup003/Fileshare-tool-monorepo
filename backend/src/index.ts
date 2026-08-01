import express from "express";
import { ConnectDb } from "./db";
import dotenv from "dotenv";
import sharedContentRoute from "./routes/sharedContent.route";
import cors from "cors";

const app = express();
app.use(cors())
dotenv.config();
ConnectDb();

app.use(express.json());

app.use("/api", sharedContentRoute);

app.get("/", (_req, res) => {
  res.send("Hello from Node + TS");
});

app.listen(process.env.PORT, () => console.log("Server is working fine."));
