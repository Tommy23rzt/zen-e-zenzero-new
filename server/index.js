import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';


//components
import Connection from './database/db.js';
import Router from './routes/route.js';
dotenv.config();

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "http://localhost:8000"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));
app.use(cors({
    origin: ['http://localhost:3000', 'https://zen-e-zenzero-new.vercel.app', 'https://zen-e-zenzero-new-9fqj8xdla-tommyrzt.vercel.app'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { msg: 'Too many requests, try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { msg: 'Too many requests, try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/login', authLimiter);
app.use('/signup', authLimiter);
app.use('/token', authLimiter);
app.use('/create', writeLimiter);
app.use('/comment/new', writeLimiter);
app.use('/file/upload', writeLimiter);

app.use('/', Router);

const PORT = process.env.PORT || 8000;

Connection();

const runDailyPing = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(12, 0, 0, 0);
    if (next <= now) {
        next.setDate(next.getDate() + 1);
    }
    const msUntilNext = next.getTime() - now.getTime();
    
    setTimeout(() => {
        if (global.mongoose?.connection?.readyState === 1) {
            global.mongoose.connection.db.admin().ping().catch(() => {});
        }
        runDailyPing();
    }, msUntilNext);
};

runDailyPing();

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
