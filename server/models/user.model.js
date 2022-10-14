const Mongoose = require('mongoose')
const bcrypt = require('bcrypt');


const UserSchema = new Mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required'],
        minlength: [3, 'first name needs to be more than 2 characters']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required'],
        minlength: [3, 'last name needs to be more than 2 characters']
    },
    age: {
        type: Number,
        required: [true, 'age is required'],
        min: [13, 'u need to be older than 12'],
        max: [120, 'age cant be more than 120']
    },
    profilePic: {
        type: String,
        default: "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg",
    },
    email: ({
        type: String,
        unique: true,
        required: [true, 'email is required'],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }),
    password: {
        type: String,
        required: [true, "please enter a password"],
        minlength: [6, "password must be more than 5 characters"]
    },
    isActive: ({
        type: Boolean,
        default: false
    }),
    address:
    {
        addressOne: ({
            type: String,
            default: ""
        }),
        addressTwo: ({
            type: String,
            default:""
        }),
        postalCode: ({
            type: String,
            defa:"",
        }),
        city: ({
            type: String,
            defa:"",
        }),
        state: ({
            type: String,
            defa:"",
        }),
        country: ({
            type: String,
            defa:""
        }),
    },
}, { timestamps: true })


UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);
//validate confirm password with password before saving to db
UserSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Passwords must match');
    }
    next();
});
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

const User = Mongoose.model('User', UserSchema);
module.exports = User;