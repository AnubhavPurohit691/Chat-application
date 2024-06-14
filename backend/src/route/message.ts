import express from "express"
import { protectRoute } from "../middleware/protectroute";
import { getmessages, getusersforsidebar, sendmeassage } from "../controller/messagecontroller";
const router=express.Router()
router.get("/conversations",protectRoute,getusersforsidebar)
router.post("/send/:id",protectRoute,sendmeassage)
router.get("/:id",protectRoute,getmessages)
export default router;