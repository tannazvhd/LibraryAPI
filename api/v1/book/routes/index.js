module.exports = (app) => {
    
    app.use('/book', require('./book.route'));

}