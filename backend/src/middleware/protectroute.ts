import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma";
interface decodedtoken extends JwtPayload{
    id:string
}
declare global {
	namespace Express {
		export interface Request {
			user: {
				id: string;
			};
		}
	}
}
export async function protectRoute(req:Request,res:Response,next:NextFunction){

    const token=req.cookies.token
    console.log(token)
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
try {
    const decoded= jwt.verify(token,process.env.JWT_SECRET!) as decodedtoken
    
    if(!decoded){
        return res.status(401).json({message:"Unauthorized"})
    }
    const user=await prisma.user.findUnique({
        where:{
            id:decoded.id
        },
        select:{
            id:true,
            email:true,
            Username:true,
            profilepic:true,
            gender:true
        }
    })
    
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    req.user=user
    
    next()

} catch (error) {
    console.log(error)
}



}
