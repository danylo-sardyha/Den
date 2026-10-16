import express from "express";
import {
  getItems,
  addItem,
  getItemById,
  updateItem,
  deleteItem,
} from "./item.controller.js";

const router = express.Router();

router.get("/", getItems);

router.get("/:id", getItemById);

router.post("/", addItem);

router.put("/:id", updateItem);

router.delete("/:id", deleteItem);

export default router;
