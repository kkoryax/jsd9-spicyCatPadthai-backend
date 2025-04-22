import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

const PORT = process.env.PORT

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`Server now running on http://localhost:${PORT}`)
})