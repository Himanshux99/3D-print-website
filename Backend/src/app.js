import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cors());

// not -> "*" as express has droped it new syntax "/*" or new regx /.*/
app.options(/.*/, cors());

import orderRoute from "./routes/order.routes.js";
app.use("/api/v1/", orderRoute);

export default app;
