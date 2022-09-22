import mongoose, { Schema, Document } from 'mongoose'


interface File {
  link: string,
  name: string
}

export interface IProduct extends Document {
  userId: mongoose.Schema.Types.ObjectId,
  productId: string, // Not to be confused with the mongo uid
  name: string,
  info?: string,
  referenceNumber?: number,
  country?: string,

  image?: File
  file?: File
  createdAt: Date,
  updatedAt: Date
}

const ProductSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  productId: {
    type: String, 
    required: true,
    minLength: 1,
    maxLength: 16
  },
  name: {
    type: String, 
    required: true,
    minLength: 1,
    maxLength: 32
  },
  info: {
    type: String, 
    required: false,
    minLength: 1,
    maxLength: 120
  },
  referenceNumber: {
    type: Number, 
    required: false,
    minLength: 0,
    maxLength: 99999999,
    set: (v: number) => Math.round(v),
  },
  country: {
    type: String, 
    required: false,
    minLength: 1,
    maxLength: 32
  },
  image: {
    type: {
      link: {
        type: String, 
        required: true,
        minLength: 1,
        maxLength: 500
      },
      name: {
        type: String, 
        required: true,
        minLength: 1,
        maxLength: 64
      },
    },
    required: false
  },
  file: {
    type: {
      link: {
        type: String, 
        required: true,
        minLength: 1,
        maxLength: 500
      },
      name: {
        type: String, 
        required: true,
        minLength: 1,
        maxLength: 64
      },
    },
    required: false
  }
},
{ timestamps: true });

const Product = mongoose.model<IProduct>('product', ProductSchema);

export default Product;
