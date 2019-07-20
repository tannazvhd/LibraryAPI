const express = require('express');
const router = express.Router();
const Books = require('../models/book.model');




   



// LIST
router.get('/', (req, res) => {
    Books
    
        .find({})
        .then(books => {
            res.json({
                status: true,
                data: books,
                msg: 'Listing books success'
            });
        })        
        .catch(err => {
            throw new Error(err);
        })
});





//ADD
router.post('/' , (req,res)=>{
    console.log(req.body);

    const {title , description , author , quantity}= req.body;
    if (title && description && author && quantity){
        let newBook = new Books(req.body);
        newBook
        .save()
        .then( book=>{
            res.json({
                status: true,
                data: book,
                msg: 'Register book successful'
            })
        })
        .catch(err=>{
            res.send('error registering book');
            throw new Error(err);
        })

    }else{
        return res.status(401).send('data is incompelete')
    }

});


//SELECT ONE
router.get('/:id' , (req,res)=>{
    const{id}=req.params;
    Books
        .findById(id)
        .then(book => {
            res.json({
                status: true,
                data: book,
                msg: 'finding book success'
            });
        })
        .catch(err => {
            throw new Error(err);
        })

});


//UPDATE
router.put('/:id' , (req,res)=>{

    const{id}= req.params;
    Books
    .findByIdAndUpdate(id,req.body,{new:true})
    .then(book => {
        res.json({
            status: true,
            data: book,
            msg: 'Update done successfully'
        });
    })
    .catch(err => {
        throw new Error(err);
    })

});



//DELETE
router.delete('/:id' , (req,res)=>{

    const{id}= req.params;
    Books
    .findByIdAndDelete(id)
    .then(book => {
        res.json({
            status: true,
            data: book,
            msg: 'Book is deleted'
        });
    })
    .catch(err => {
        throw new Error(err);
    })

});





module.exports = router;