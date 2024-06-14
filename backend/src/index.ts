import express from "express"

import cookieParser from "cookie-parser"
const app=express()
import authroutes from "./route/auth"
import messageroutes from "./route/message"
import cors from "cors"

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))
app.use("/api/auth",authroutes)
app.use("/api/message",messageroutes)

app.listen(process.env.PORT,()=>console.log(`server is running on port ${process.env.PORT}`))

