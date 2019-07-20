var express = require('express');
var router = express.Router();
const Books = require('../../book/models/book.model');


router.get('/:id', (req,res)=> {


 

  const {id} =req.params;

Books
.findById(id)
.then( book =>{

    if (book){

      let newQuantity = book.quantity-1;
      // console.log(newQuantity);
      Books
      .findByIdAndUpdate
      (id, {quantity : newQuantity }, {new:true})
      .then(book => {
     
        res.json( book );
      })
      .catch(
        err=>{
          res.send('ERROR');
          throw new Error(err);
      });
    }else{
      return res.send('book is not found');
    }

}
)
.catch(err=>{
  res.send('Id is incorrect');
  throw new Error(err);
})

});

module.exports = router;
