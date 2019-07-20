const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const guard = require('../services/guard');
const User = require('../models/User.model');
const type = require('../models/type.model');
var multer = require('multer');
var Image =require('../models/image.model');


//set storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function( req, file , cb){
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }

});

//upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }
}).single('files');

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']
    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")
    if(isAllowedExt && isAllowedMimeType){
        return cb(null ,true) // no errors
    }
    else{
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}




// LIST
router.get('/', (req, res) => {
    User
        .find({})
        .populate('type' ,["name"])
        .then(users => {
            res.json({
                status: true,
                data: users,
                msg: 'Listing users success'
            });
        })
        .catch(err => {
            throw new Error(err);
        })
});





// Add Type
router.post('/type', (req, res) => {
    const {name}=req.body;
    if ( name){
        let newType = new type (req.body)
        newType
        .save()
        .then ( type => {
            res.json(type);
        })
        .catch(err =>{
            res.send('ERROR');
            throw new Error(err);
        })

    }else{
        return res.send('no type found')
    }

});


// REGISTER

//Upload image
router.post('/',(req , res)=> {
    // res.send('done');
    upload(req, res, (err) => {
        if (err){ 
            res.send('ERROR');
            throw new Error(err);
        }else{

            if (req.file == undefined) {
                res.send('no file is selected');
               
            
            }
            else{
                Image
                .save()
                .then ( img => {
                    res.json(img);
                })
                .catch(err =>{
                    res.send('ERROR');
                    throw new Error(err);
                })
               res.send('File uploaded successfully!');
            }
        }
    
    })
})




router.post('/', (req, res) => {
    const { username, password, email } = req.body;

    if (username && password && email){

        User
            .findOne({ email })
            .then(user => {
                if (!user){
                    let newUser = new User(req.body);
                        newUser
                            .save()
                            .then(user => {
                                res.json({
                                    status: true,
                                    data: user,
                                    msg: 'Register user successful'
                                });
                            })
                            .catch(err => {
                                res.status(500).send({
                                    status: false,
                                    msg: 'Error registering User'
                                });
                                throw new Error(err);
                            })
                } else {
                    res.status(409).send({
                        status: false,
                        msg: 'user already exist'
                    });
                }
            })
    } else {
        res.status(500).send({
            status: false,
            msg: 'incorrect data'
        });
    }
});



router.post('/login', (req, res) => {
    
    const { email, password } = req.body;


    if (email && password){

        User
            .findOne({email})
            .then(user => {
                if (user){
                    
                    // Compare Password
                    user.comparePassword(password, function(err, isMatch){
                        if (err) throw new Error(err);

                        if (!err && isMatch){
                            
                            // Token

                            let claims = {
                                expiresIn : '6h',
                                issuer: 'hesanam',
                                audience: 'bacheha'
                            };

                            let payload = {
                                username : user.username,
                                email: user.email
                            }

                            jwt.sign(payload, 'TEST', claims, function(err, token){
                                if (!err){
                                    res.json({
                                        status: true,
                                        msg: 'Login successful',
                                        data: token
                                    });
                                }
                            });

                        } else {
                            res.json({
                                status: false,
                                msg: 'User/Password incorrect'
                            });
                        }

                    });
                    
                } else {
                    res.status(404).send({
                        status: false,
                        msg: 'user not found'
                    });
                }
            })

    } else {
        res.status(500).send({
            status: false,
            msg: 'incorrect data'
        });
    }

});






// AUTH
// Update
router.put('/:id', guard, (req, res) => {
    const{id}=req.params;
    User
    .findByIdAndUpdate(id , req.body , {upset: true},{new:true})
    .then ( usr => {
        res.json(usr);
    })
    .catch(err =>{
        res.send('ERROR');
        throw new Error(err);
    })

});


// Delete
router.delete('/:id', guard, (req, res) => {
    const {id}=req.params;
    User
    .findByIdAndDelete(id)
    .then ( usr => {
        res.json(usr);
    })
    .catch(err =>{
        res.send('ERROR');
        throw new Error(err);
    })

});

//Logout
router.get('/logout', (req, res) => {

    res.json({ status: true,
        msg: 'Logout successfully',
     }).code(200)

   
});


module.exports = router;