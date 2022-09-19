import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
const cors = require('cors')
import express, { Application, NextFunction, Request, Response } from 'express';

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ranpak.t7dhboy.mongodb.net/?retryWrites=true&w=majority`);
mongoose.connection.on('error', (err) => {
  console.log('Failed to connect MongoDB', err);
});

const app: Application = express();

app.use(express.json());
app.use(cookieParser(process.env['COOKIE_SECRET']));
// TODO: Setup dynamic cors policy when deploying
app.use(cors( {
  credentials: true,
  origin: "http://localhost:4200 " // client address
})) 




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const router = express.Router();

router.use('/user', require('./routes/user'));

app.use('', router);