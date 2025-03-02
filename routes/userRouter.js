import { Router } from "express";
import { register, login, getProfile, updateProfile, logout } from "../controllers/UserControllers.js";
import authenticateToken from "../middlewares/authmiddleware.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile",  authenticateToken, getProfile).post("/profile", authenticateToken, updateProfile);
userRouter.post("/logout", logout);


export default userRouter;