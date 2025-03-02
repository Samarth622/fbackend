import { Router } from "express";
import authenticateToken from "../middlewares/authmiddleware.js";
import { categoryProduct, productAnalysis, imageAnalysis, suggestProduct } from "../controllers/ProductController.js";
import multer from "multer";

const productRouter = Router();

const upload = multer({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    storage: multer.memoryStorage(), // Store in memory for Vision API
});

productRouter.get("/category/:categoryName", authenticateToken, categoryProduct);
productRouter.get("/productAnalysis/:productName", authenticateToken, productAnalysis);
productRouter.post("/productAnalysis", authenticateToken, upload.single('image'), imageAnalysis);
productRouter.get("/productSuggest", authenticateToken, suggestProduct);

export default productRouter;