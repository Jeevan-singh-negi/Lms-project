import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks , stripeWebhooks} from "./controllers/webhooks.js";

import { clerkMiddleware } from "@clerk/express";
import educatorRouter from "./routes/educatorRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Initialize Express
const app = express();

//connect to database
await connectDB();
await connectCloudinary();

//Middlewares
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

//Routes
app.get("/", (req, res) => res.send("API working"));

app.post("/clerk", express.json(), clerkWebhooks);

app.use("/api/educator", educatorRouter);

app.use("/api/course", courseRouter);

app.use('/api/user', userRouter)


app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhooks)
//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
