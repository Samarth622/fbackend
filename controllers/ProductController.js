import Product from "../models/Product.js";
import User from "../models/User.js";
import { GeminiAna, PhotoAna, SuggestFood } from "../utils/aiAnalysis.js";
import FormData from "form-data";
import axios from "axios";

const categoryProduct = async (req, res) => {
    try {
        const { categoryName } = req.query;

        const products = await Product.findAll({
            where: { category: categoryName }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found in this category" });
        }

        res.status(200).json({products});
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const productAnalysis = async (req, res) => {
    try {

        const { productName } = req.query;
        const product = await Product.findOne({
            where: { name: productName },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });


        if (product.length === 0) {
            return res.status(404).json({ message: "No products found in this category" });
        }

        const user = await User.findByPk(req.user.uid, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        const response = await GeminiAna(user, product);
        if (!response) {
            res.status(401).json({ message: "Some problem comes from ai model to generate response." });
        }

        res.status(200).json({ "analysis" :response, "productImage": product.image_url});

    } catch (error) {
        console.log("Error while analysis: ", error);
        res.status(500).json({ message: "Some Error comes while product analysis." })
    }
}

const imageAnalysis = async (req, res) => {
    try {

        if (!req.file) {
            res.status(400).json({ message: 'No image file provided' });
        }

        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.file.mimetype)) {
            res.status(400).json({ message: 'Invalid file type. Only JPEG and PNG are allowed.' });
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post('http://localhost:5000/extract-text', formData, {
            headers: formData.getHeaders(),
        });

        if (!response.data || !response.data.extracted_text) {
            res.status(400).json({ message: 'No text detected in the image' });
        }

        console.log(response.data.extracted_text)

        const user = await User.findByPk(req.user.uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        const analysis = await PhotoAna(user, response.data.extracted_text);

        console.log(analysis)

        if(!analysis){
            res.status(400).json({ message: "Some problem comes while analysis." });
        }

        res.status(200).json({ "analysis": analysis });

    } catch (error) {
        console.log("Some error comes while analyse photo analysis: ", error);
        res.status(500).json({ error: "Something went wrong while in photo analysis." })
    }
}

const suggestProduct = async (req, res) => {
    try {
        
        const user = await User.findByPk(req.user.uid, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
    
        const response = await SuggestFood(user);
        if(!response){
            res.status(400).json({ message: "Some problem comes while analysis." });
        }
    
        res.status(200).json(response);

    } catch (error) {
        console.log("Suggestion food error: ", error);
        res.status(500).json({ message: "Something went wrong while suggestion food." });
    }
}

export { categoryProduct, productAnalysis, imageAnalysis, suggestProduct };