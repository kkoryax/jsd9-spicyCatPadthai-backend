import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

const PORT = process.env.PORT

//CREATE Middleware to parse JSON to JavaScript Object
app.use(express.json());

//CONNECT to MongoDB
(async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connecting to MongoDB successfully ✅`);
    } catch (err) {
        console.error(`Database Connection failed: ${err}`);
        process.exit(1);
    }
})();

app.listen(PORT, () =>{
    console.log(`Server now running on http://localhost:${PORT}`)
})