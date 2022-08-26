import  express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors";

dotenv.config()

const app = express()
const PORT = process.env.PORT;
app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
      optionsSuccessStatus: 200,
    })
);

import authRoutes from "./routes/auth"
import providerAuthRoutes from "./routes/providerAuth"
import providerList from './routes/providerList'
import orderRoutes from "./routes/orders"
import putItemsInStockRoutes from "./routes/providerStock"
import adminAuthRoutes from "./routes/adminAuth"
import adminDataRoutes from "./routes/adminData"
import imageUploadRoutes from "./routes/imgUpload"
import graphDataRoutes from "./routes/graphDataProvider"

app.use(morgan("dev"))
app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
      optionsSuccessStatus: 200,
    })
  );
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/auth", providerAuthRoutes)
app.use("/api/auth",adminAuthRoutes)
app.use("/api", providerList)
app.use("/api/orders", orderRoutes)
app.use("/api/providerStock", putItemsInStockRoutes)
app.use("/api/adminAuth",adminAuthRoutes)
app.use("/api/adminData", adminDataRoutes)
app.use("/api/imgUpload", imageUploadRoutes)
app.use("/api/graphDataProvider", graphDataRoutes)

app.get('/', (_, res) => res.send("Hello World!"))

app.get('/', function (req, res) {
  console.log(req.socket.remoteAddress);
  console.log(req.ip);
  res.send("your IP is: " + req.ip);
})


app.listen(5000, async () => {
    console.log(`Server running at http://localhost:${PORT}`)

    try {
        console.log("Database Connected!")
    } catch (err) {
        console.log(err)
    }
})

