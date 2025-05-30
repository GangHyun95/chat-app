import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
