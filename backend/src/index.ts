import paymentRoutes from './routes/paymentRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import routeRoutes from './routes/routeRoutes';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 if PORT not set

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://5173-firebase-shareride-proyecto-completo-1749079509796.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev"
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
