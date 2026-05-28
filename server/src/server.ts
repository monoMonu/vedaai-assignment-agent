import express, { ErrorRequestHandler } from 'express'
import { PORT } from './config';
import connectDB from './lib/db';
import morgan from 'morgan'
import assignmentRoutes from './routes/assignment.routes';
import paperRoutes from './routes/paper.routes';
import './workers/assignment.worker'
import { createServer } from 'node:http';
import { initSocket } from './lib/socket';
import cors from 'cors'

const app = express();
const httpServer = createServer(app);
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
}
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({
    status: 200,
    message: "Server running perfect!"
  })
})
app.use('/api/assignments', assignmentRoutes);
app.use('/api/papers', paperRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
};
app.use(errorHandler);


const startServer = async () => {
  try {
    await connectDB();
    initSocket(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server.")
  }
}

startServer();