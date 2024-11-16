import dotenv from 'dotenv'
import express from 'express'
import mongoose from "mongoose";
import path from 'path'
import cors from 'cors'
import {taskRouter} from './Routers/Task.Router.mjs'
import {Task} from './Models/Task.Model.mjs'
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

try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');

const newTask = new Task({
    title: "Prvi task",
    content: "Opis",
  });
  
  await newTask.save();
  console.log('Task uspesno dodat v bazo');
} catch (error){
    console.error(error);
}


app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, "..", "client", "public", 'index.html'))
})

app.listen(PORT,()=>{
    console.log(`Server listening on https://localhost:${PORT} ...`);  
})