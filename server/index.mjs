import dotenv from 'dotenv'
import express from 'express'
import mongoose from "mongoose";
import path from 'path'
import cors from 'cors'
import {taskRouter} from './Routers/Task.Router.mjs'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
//app.use(express.static(path.join(__dirname, "..", "client", "public")));
/*app.use(cors({
    origin: 'https://localhost:8080'
}))*/
app.use('/task',taskRouter)

mongoose.connect(process.env.MONGO_URL, () => console.log("Connected to DB."));

app.get('*',(req,res)=>{
    //res.sendFile(path.resolve(__dirname, "..", "client", "public", 'index.html'))
    res.send();
})

app.listen(PORT,()=>{
    console.log(`Server listening on https://localhost:${PORT} ...`);  
})