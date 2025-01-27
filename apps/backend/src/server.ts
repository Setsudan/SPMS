import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { swaggerDocs } from './config/swagger';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/auth';
import urlRoutes from './routes/url';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(authenticate);

// Routes
app.use('/auth', authRoutes);
app.use('/', urlRoutes);

// Swagger Docs
app.use('/api-docs', swaggerDocs);

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
