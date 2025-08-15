import express from 'express' 
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js';

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();


//middleware
app.use(express.json())
app.use(cors())


//api endpoints
app.use('/api/admin', adminRouter);
// localhost:4000/api/admin/

app.use('/api/doctor', doctorRouter);
// localhost:4000/api/doctor/


app.get('/', (req, res) => {
  res.send('API Working!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});