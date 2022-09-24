import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
const cors = require('cors')
import express, { Application, NextFunction, Response } from 'express';
import AWS, { Request } from 'aws-sdk';

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
  origin: `${process.env.origin}` // client address
})) 


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req: any, res: Response) => {
  res.status(200).json({});
});


const router = express.Router();

router.use('/user', require('./routes/user'));
router.use('/product', require('./routes/product'));

app.use('', router);


AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack); 
  // credentials not loaded
});

