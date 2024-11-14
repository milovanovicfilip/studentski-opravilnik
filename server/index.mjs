import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(cors({
    origin: 'https://localhost:5500'
}))

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, "..", "client", "public", 'index.html'))
})

app.listen(PORT,()=>{
    console.log(`Server listening on https://localhost:${PORT} ...`);  
})