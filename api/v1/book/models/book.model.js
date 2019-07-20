const db = require('../bootstrap/db');
const Schema = db.Schema;


const booksSchema = new Schema({
    title : { type: String, required: true },
    description : { type: String, required: true },
    author : { type: String, required: true },
    quantity : { type: Number, required: true },

});



module.exports = db.model('Books', booksSchema);