const db = require('../bootstrap/db');
const Schema = db.Schema;
 
const typeSchema = new Schema ({
    name :{ type : String , required:true}
});


module.exports = db.model('type' , typeSchema);