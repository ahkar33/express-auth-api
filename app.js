import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './routes/authRoutes.js'

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1:27017/auth", () => console.log("Connected to MongoDB"));
mongoose.connect("mongodb+srv://ahkar33:A09599m376*@auth.deuhhaf.mongodb.net/?retryWrites=true&w=majority", () => {
  console.log("Connected to MongoDB");
});

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json());

app.use('/auth', authRouter);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

