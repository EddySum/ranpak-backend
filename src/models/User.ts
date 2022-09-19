import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 254,
    validate: {
      validator: (email: string) => {
        // Need to setup regex here to validate it is a valid email
        // Should probably be a basic validator as the rest of the verification should be done by verifying via an email
        return true;
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 60,
    select: false,
  }
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;
