import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
const cors = require('cors')
import express, { Application, NextFunction} from 'express';
const path = require('path');

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@ranpak.t7dhboy.mongodb.net/?retryWrites=true&w=majority`);
mongoose.connection.on('error', (err) => {
  console.log('Failed to connect MongoDB', err);
});

const app: Application = express();



app.use(cors( {
  credentials: true,
  origin: `${process.env.origin}` // client address
})) 
app.use(express.json());
app.use(cookieParser(process.env['COOKIE_SECRET']));
// TODO: Setup dynamic cors policy when deploying






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


const router = express.Router();

router.use('/user', require('./routes/user'));
router.use('/product', require('./routes/product'));

app.use('', router);

app.use(express.static(path.join(__dirname, '../../ranpak/dist/ranpak/')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ranpak/dist/ranpak/index.html'))
})



