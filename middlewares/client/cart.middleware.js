const Cart = require("../../models/cart.model")
module.exports.cartId = async (req, res, next) => { 
    if(!req.cookies.cartId){
        //tạo giỏ hàng lần đầu
        const cart = new Cart();
        await cart.save()
        //lưu số ng
        const expiresTime = 1000 * 60 * 60 * 24 * 365
        res.cookie("cartId",cart.id,{expires: new Date(Date.now() + expiresTime)})
    }else{
        const cart = await Cart.findOne({
            _id:req.cookies.cartId
        })
        // console.log(cart)
        cart.totalQuantity = cart.products.reduce((sum,item) => sum + item.quantity, 0);
        res.locals.miniCart = cart // thêm 1 biến toàn cầu miniCart

    }
    next();
};