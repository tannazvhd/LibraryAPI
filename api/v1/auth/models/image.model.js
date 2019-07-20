const db = require('../bootstrap/db');
const Schema = db.Schema;
 
const ImageSchema = new Schema ({
    filename :{ type : String , required:true},

});


module.exports = db.model('Image' , ImageSchema);