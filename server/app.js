import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config/env.js";
import { connectToDatabase } from "./database/db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import courseRouter from "./routes/course.route.js";
import enrollmentRouter from "./routes/enrollement.route.js";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/enrollments", enrollmentRouter);
app.use(errorMiddleware);

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
};

startServer();
