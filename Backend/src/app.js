import express from "express";
import itemRoutes from "./modules/items/item.routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
  res.send("Divvy API is running!");
});

export default app;
