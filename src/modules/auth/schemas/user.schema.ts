import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: {type: String, index: true, unique: true},
    password: String,
    first_name: {type: String, index: true},
    last_name: {type: String, index: true},
    email: {type: String, index: true, unique: true},
    phone: {type: String, index: true, unique: true},
    age: Number,
    created_at: {type: Date, default: Date.now},
});
