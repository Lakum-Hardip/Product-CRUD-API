import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../Controller/ProductController.js";

const router = express.Router();

// CREATE PRODUCT
router.post("/", createProduct);

// GET ALL PRODUCTS + PAGINATION
router.get("/", getProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;