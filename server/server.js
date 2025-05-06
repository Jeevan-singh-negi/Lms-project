import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDB from "./configs/mongodb.js";
import {clerkWebhooks} from "./controllers/webhooks.js";


// Initialize Express
const app = express();


//connect to database
await connectDB();


//Middlewares
app.use(cors());


//Rotes
app.get("/", (req, res) => res.send("API working"));

app.post('/clerk',express.json(),clerkWebhooks)


//Port
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
