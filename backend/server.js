import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./model/product.model.js";

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.post("/api/products", async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res
      .status(500)
      .json({ success: false, message: "Enter all the fields." });
  }

  try {
    const newProduct = new Product(product);
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ succcess: false, message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ success: false, message: "No Product Found" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ succcess: true, message: "Deleted Successfully." });
  } catch (error) {
    console.error(error.message);
    res
      .status(404)
      .json({ succcess: false, message: "No product found by the id." });
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on http:localhost:${PORT}`);
});
