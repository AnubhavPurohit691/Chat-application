import { Request, Response } from "express"
import prisma from "../db/prisma"

   import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function signup(req:Request,res:Response){
    try {
        const {fullName,Username,password,gender,email}=req.body
        if(!fullName || !Username || !password || !gender||!email){
            return res.status(400).json({message:"All fields are required"})
        }
        const existuser=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(existuser){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedpassword=await bcrypt.hash(password,10)
        const boypic=`https://avatar.iran.liara.run/public/boy?username=${Username}`
        const girlpic=`https://avatar.iran.liara.run/public/girl?username=${Username}`
       const newuser= await prisma.user.create({
            data:{
                fullName,
                Username,
                password:hashedpassword,
                gender,
                profilepic:gender==="male"?boypic:girlpic,
                email
            }
        })
        if(newuser){
            const token=jwt.sign(newuser,process.env.JWT_SECRET!)
        res.cookie("token",token,{
            maxAge: 15 * 24 * 60 * 60 * 1000, // MS,
            httpOnly: true, // prevent XSS cross site scripting
            sameSite: "none", // CSRF attack cross-site request forgery
            secure: process.env.NODE_ENV !== "development", // HTTPS
        })
        res.status(201).json(newuser)
        }
    else{
        res.status(400).json({message:"Invalid user data"})
    }
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}
export async function login(req:Request,res:Response){
   try {
    const {email,password}=req.body
    const existinguser=await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!existinguser){
        return res.status(400).json({message:"User does not exist"})
    }
    const iscorrectPassword=await bcrypt.compare(password,existinguser.password)
    if(!iscorrectPassword){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const token=jwt.sign(existinguser,process.env.JWT_SECRET!)
    res.cookie("token",token,{
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS,
		httpOnly: false, // prevent XSS cross site scripting
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development", // CSRF attack cross-site request forgery
		 // HTTPS
	})
    res.status(200).json(existinguser)
   
   } catch (error) {
    res.status(500).json({message:"Something went wrong"})
   }
   

}
export function logout(req:Request,res:Response){
    try {
        res.clearCookie("realtime")
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log(error)
        res.send("error in server")
    }
}
export async function getme(req:Request,res:Response){
    try {
        const existuser=await prisma.user.findUnique({
            where:{
                id:req.user.id           }
        })
        res.status(200).json(existuser)
    } catch (error) {
        console.log(error)
        res.send("error in server")
    }
}