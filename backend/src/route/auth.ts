import express from "express"
const router = express.Router()
import {login,signup,logout,getme} from "../controller/authcontroller"
import { protectRoute } from "../middleware/protectroute"
router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout )
router.get("/me",protectRoute,getme )

export default router