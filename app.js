import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import compression from 'compression';
import xss from 'xss-clean';
import dotenv from 'dotenv';
import 'colors';

// routes
import products from './routes/products.js';
import NotFoundError from './errors/notFound.js';
import errorHandleMiddlewarer from './middlewares/errorHandler.js';

dotenv.config({ path: './config.env' });

// start express app
const app = express();

// global middlewares
// implement CORS
app.use(cors());
// access-control-allow-origin
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// development logging
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: ['name', 'price', 'rating', 'company', 'featured'],
  })
);

// compression middleware
app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// api routes
app.use('/api/v1/products', products);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandleMiddlewarer);

export default app;
