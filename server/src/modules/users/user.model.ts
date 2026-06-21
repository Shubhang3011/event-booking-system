import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // `select: false` keeps the hash out of every query result by default.
    passwordHash: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const r = ret as unknown as Record<string, unknown>;
        r.id = r._id;
        delete r._id;
        delete r.__v;
        delete r.passwordHash;
        return r;
      },
    },
  },
);

userSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Guard against re-registration when modules are re-evaluated (e.g. test isolation).
export const User: Model<UserDoc> = (models.User as Model<UserDoc>) || model<UserDoc>('User', userSchema);
