
import {Router, Request, Response} from 'express';
import { authenticate } from '../middlewares/auth';
import Product, { IProduct } from '../models/Product';
const multer  = require('multer');
const multerS3 = require('multer-s3')
import AWS from 'aws-sdk';

const s3 = new AWS.S3();


const router = Router();

// Any being used below as multer s3 library is not typed.
const uploadMw = multer({
    storage: multerS3({
      s3: s3,
      bucket: `${process.env.BUCKET_NAME}`
    })
}).fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }])
router.post('/', [authenticate(), uploadMw], async (req: Request, res: Response) => {
  try {
        const userID = res.locals.userID;
        const { productId, name, info, referenceNumber, country} = JSON.parse(req.body.data);

        const files = req.files as unknown as {[fieldName: string] : Express.Multer.File[]}
        const image = files?.['image']?.[0];
        const file = files?.['file']?.[0];

   
        const imgPayload = file ? {
            // @ts-ignore - field exists with s3-multer library. TODO: Fix typing by multer library
            link: image.location, 
            name: image.originalname
        } : undefined

        
        const filePayload = file ? {
            // @ts-ignore - field exists with s3-multer library. TODO: Fix typing by multer library
            link: file.location, 
            name: file.originalname
        } : undefined
   
        
        const product = await Product.create({
            userId: userID,
            productId: productId,
            name: name,
            info: info,
            referenceNumber: referenceNumber,
            country: country,
            image: imgPayload,
            file: filePayload
        });

        if(!product) {
            return res.status(422).send;
        }

       return res.status(200).json(product);
    } catch(e) {
      res.status(400).json(e);
    }
});

router.get('/', [authenticate()], async (req: Request, res: Response) => {
    try {
        const userID = res.locals.userID;

  
        const products = await Product.find({userId: userID});
        
        return res.status(200).json(products);
      } catch(e) {
        return res.status(400).json(e);
      }
});

router.patch('/:id', [authenticate(), uploadMw], async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
  
        const userID = res.locals.userID;
        const { productId, name, info, referenceNumber, country} = JSON.parse(req.body.data);

        const files = req.files as unknown as {[fieldName: string] : Express.Multer.File[]}
        const image = files?.['image']?.[0];
        const file = files?.['file']?.[0];


        const imgPayload = file ? {
            // @ts-ignore - field exists with s3-multer library. TODO: Fix typing by multer library
            link: image.location, 
            name: image.originalname
        } : undefined

        
        const filePayload = file ? {
            // @ts-ignore - field exists with s3-multer library. TODO: Fix typing by multer library
            link: file.location, 
            name: file.originalname
        } : undefined

        const productChanges: Partial<IProduct> = {
          userId: userID,
          productId: productId,
          name: name,
          info: info,
          referenceNumber: referenceNumber,
          country: country,
          image: imgPayload,
          file: filePayload
      }


        Object.keys(productChanges).forEach((key: string) => {
          if (productChanges[key as keyof IProduct]  === undefined) {
            delete productChanges[key as keyof IProduct];
          }
        });
   
        // TODO: Get original Product s3 links and delete the s3 file. This should reduce s3 costs.
        const product = await Product.findOneAndUpdate({userId: userID, _id: id}, productChanges, {new: true});
        
        return res.status(200).json(product);
      } catch(e) {
        return res.status(400).json(e);
      }
});

router.delete('/:id', [authenticate()], async (req: Request, res: Response) => {
  try {
      const { id } = req.params;

      const userID = res.locals.userID;
  
      // TODO: Get original Product s3 links and delete the s3 file. This should reduce s3 costs.
      const deleteResp = await Product.findOneAndDelete({userId: userID, _id: id});
      if(!deleteResp) throw Error('Deletion failed');
      
      return res.status(200).json({});
    } catch(e) {
      return res.status(400).json(e);
    }
});


module.exports = router;