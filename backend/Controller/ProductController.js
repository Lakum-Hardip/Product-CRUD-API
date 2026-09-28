import Product from "../Models/Product.js";

// ==========================
// CREATE PRODUCT
// ==========================
export const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        const product = await Product.create({
            name,
            price,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================
// GET PRODUCTS + PAGINATION
// ==========================
export const getProducts = async (req, res) => {
    try {
        // page and limit from URL
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // Calculate skip
        const skip = (page - 1) * limit;

        // Get total products
        const totalProducts = await Product.countDocuments();

        // Get products
        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        // Total pages
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalProducts,
            totalPages,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================
// GET SINGLE PRODUCT
// ==========================
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================
// UPDATE PRODUCT
// ==========================
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================
// DELETE PRODUCT
// ==========================
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};