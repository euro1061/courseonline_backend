import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import rateLimit from 'express-rate-limit';
import { corsOption } from './src/resource/option';
import { env } from './src/env';
import { createApi } from './src/api';

const app = express();

app.use(helmet());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 200
}));
app.use((req, _, next) => {
    console.log(`api is callled %o`, req.baseUrl + req.path)
    next()
});

app.use(`/${env.prefix}${env.versionApi}/health`, (req: Request, res: Response) => {
    const { from } = req.query;
    from && console.log(`from: ${from}`);
    res.status(200).json({
        status: true,
        message: 'Server is running'
    });
});

createApi(app);

const server = http.createServer(app);
const PORT = env.mode === 'development' ? env.portDev : env.portProd;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});