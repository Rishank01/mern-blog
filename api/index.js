import dotenv from 'dotenv';
import express from 'express'; // Since we are using the import express from express , So we must use the type as module in package.json
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

// Database connection
mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log("DB Connection Successfull");
})
.catch((error) => {
    console.log("Error while connecting to the DB" , error);
}) 


const app = express();

app.use(express.json()); // Middleware

// Listening the Server
app.listen(3000 , () => {
    console.log("Server is running on the port number 3000");
});

app.use('/api/user' , userRoutes);
app.use('/api/auth' , authRoutes);

