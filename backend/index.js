import express from "express";
import cors from "cors"
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { adminRouter } from "./Routes/adminRoute.js"
import { teacherRouter } from "./Routes/teacherRoute.js";
import { studentRouter } from "./Routes/studentRoute.js";


const app = express()
app.use(cors({
    origin: ["https://school-management-system-rho-orpin.vercel.app", "http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(cookieParser()) 
app.use('/auth', adminRouter)
app.use('/teacher', teacherRouter)
app.use('/student', studentRouter)
app.use(express.static('Public'))

// Middleware to authenticate JWT
const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if(token) {
        Jwt.verify(token, 'jwt_secret_key', (error, decoded) => {
            if(error) return res.json({Status: false, Error: 'Wrong Token'})
            req.id = decoded.id
            req.role = decoded.role
            next()
        })
    } else {
        return res.json({Status: false, Error: 'Not authenticated'})
    }
}

app.get('/verify', verifyUser, (req, res) => {
    return res.json({Status: true, role: req.role, id: req.id})
})


app.listen(4000, () => {
    console.log("Server is running")
})   