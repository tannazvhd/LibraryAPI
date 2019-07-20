const db = require('../bootstrap/db');
const Schema = db.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name : { type: String, required: true },
    familyname : { type: String, required: true },
    age : { type: Number, required: true },
    type : [{ type: Schema.ObjectId, ref : 'type' }],
    // avatar: {data: Buffer, contentType: String},
    username : { type: String, required: true },
    password : { type: String, required: true },
    email : { type: String, required: true, unique: true }
},{
    collection: 'users',
    timestamps: true
});


// Mongoose Hooks
UserSchema.pre('save', function(next){
    let user = this;
    if (user.isModified('password') || user.isNew){
        bcrypt.genSalt(10, function(err, salt){
            if (err) throw new Error(err);
            bcrypt.hash(user.password, salt, function(err, hashedPass){
                if (err) throw new Error(err);
                user.password = hashedPass;
                next();
            })
        });
    } else { next() }
});


UserSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, function(err, isMatch){
        cb(err, isMatch);
    });
}


module.exports = db.model('User', UserSchema);