import * as mongoose from 'mongoose';

export const EmailVerifySchema = new mongoose.Schema({
    _userId: {type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: 43200},
});
