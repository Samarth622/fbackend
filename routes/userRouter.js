import { Router } from "express";
import { register, login, getProfile, updateProfile, logout, forgetPassword, requestOTP, verifyOTP, resetPassword } from "../controllers/UserControllers.js";
import authenticateToken from "../middlewares/authmiddleware.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/forgetPassword/request-otp", requestOTP);
userRouter.post("/forgetPassword/verify-otp", verifyOTP);
userRouter.post("/forgetPassword/reset-password", resetPassword);
userRouter.get("/profile",  authenticateToken, getProfile).post("/profile", authenticateToken, updateProfile);
userRouter.post("/logout", logout);


export default userRouter;