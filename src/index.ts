import express,{ Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./Routes/routes";

dotenv.config();

const app:Express=express();
const Port = Number(process.env.PORT) || 3030;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in your .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(()=>console.log('mongoose connected'))
.catch((err)=>console.log(err))

app.use('/', routes)

app.listen(Port,()=>console.log(`server running  on ${Port}`))
