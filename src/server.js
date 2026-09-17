import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';

import { connectMongoDB } from './db/connectMongoDB.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import logger from './middleware/logger.js';
import helmet from 'helmet';
import productRouts from './routes/productsRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3030;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(productRouts);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
