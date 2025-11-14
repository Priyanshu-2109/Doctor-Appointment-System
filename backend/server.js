import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())

// Robust CORS for Render backend + Vercel frontend
const allowList = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // mobile apps, curl, SSR
    const ok = allowList.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname)
    return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Let cors package echo back requested headers to avoid preflight mismatches
  // Common additional headers are handled automatically (Accept, X-Requested-With, etc.)
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))