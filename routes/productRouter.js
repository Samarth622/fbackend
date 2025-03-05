import { Router } from "express";
import authenticateToken from "../middlewares/authmiddleware.js";
import { categoryProduct, productAnalysis, imageAnalysis, suggestProduct } from "../controllers/ProductController.js";
import multer from "multer";

const productRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(), // Store in memory for OCR API
});

productRouter.get("/category", authenticateToken, categoryProduct);
productRouter.get("/productAnalysis", authenticateToken, productAnalysis);
productRouter.post("/imageProductAnalysis", authenticateToken, upload.single("image"), imageAnalysis);
productRouter.get("/productSuggest", authenticateToken, suggestProduct);

export default productRouter;