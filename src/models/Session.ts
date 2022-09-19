import mongoose, {Schema, Document } from 'mongoose';


export interface ISession extends Document {
  userID: mongoose.Schema.Types.ObjectId
}

const sessionSchema: Schema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Session = mongoose.model<ISession>('session', sessionSchema);

export default Session;