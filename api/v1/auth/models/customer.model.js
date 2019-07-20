const db = require('../bootstrap/db');
const Schema = db.Schema;

const CustomerSchema = new Schema({
    book : [{ type: Schema.ObjectId, ref : 'book' }],
    user : { type: Schema.ObjectId, ref : 'user' },
    quantity : { type: Number, required: true },
},{
    collection: 'users',
    timestamps: true
});




module.exports = db.model('customer', CustomerSchema);