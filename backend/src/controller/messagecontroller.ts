import { Request, Response } from "express";
import prisma from "../db/prisma";

export const sendmeassage=async (req:Request,res:Response)=>{
try {
 const {message} = req.body; 
 const {id:receiverid} = req.params;
 const senderId = req.user.id;

 let conversation = await prisma.conversation.findFirst({
    where:{
        participantId:{
            hasEvery:[senderId,receiverid]
        }
    }
 })

 if(!conversation){
    conversation = await prisma.conversation.create({
        data:{
            participantId:{
                set:[senderId,receiverid]
            }
        }
    })
 }

 const newmessage = await prisma.message.create({
    data:{
        senderId,
        conversationId:conversation.id ,
       body: message
    }
 })
 if(newmessage){
    conversation=await prisma.conversation.update({
        where:{
            id:conversation.id
        },
        data:{
            messages:{
                connect:{
                    id:newmessage.id
                }
            }
        } 
    })
 }
 console.log(newmessage)
res.status(201).json(newmessage)

} catch (error) {
    res.status(400).json({message:"Something went wrong"})
}
}

export const getmessages=async (req:Request,res:Response)=>{
    try {
        const {id:usertochatwith}=req.params
        const senderId=req.user.id
        const conversation=await prisma.conversation.findFirst({
            where:{
                participantId:{
                    hasEvery:[senderId,usertochatwith]
                }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:"asc" // ascending order
                    }
                }
            }
        })
        if(!conversation){
            return res.status(400).json({message:"Conversation not found"})
        }
       
        res.status(200).json(conversation.messages)
    } catch (error) {
        res.status(400).json({message:"Something went wrong"})
    }
}
export async function getusersforsidebar(req:Request,res:Response){
try {
    const authuserId=req.user.id
    
    const users= await prisma.user.findMany({
        where:{
            id:{
                not:authuserId
            }
        },
        select:{
            id:true,
            fullName:true,
            profilepic:true,    

        }
    })
    res.status(200).json(users)

} catch (error:any) {
    
}
}