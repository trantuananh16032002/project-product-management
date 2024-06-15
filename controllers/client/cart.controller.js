const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const productsHelper = require("../../helpers/product");
const User = require("../../models/user.model");

// [POST] cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId; //id giỏ hàng
  const productId = req.params.productId; //id sản phẩm
  const quantity = parseInt(req.body.quantity); //số lượng cần lấy
  const cart = await Cart.findOne({
    _id: cartId,
  });
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  console.log(existProductInCart);
  if (existProductInCart) {
    // console.log("cập nhật số lượng")
    // console.log(quantity)
    const newQuantity = quantity + existProductInCart.quantity;
    // console.log(newQuantity)
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    //đưa ra giỏ hàng cần lưu
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }
  req.flash("success", "Thêm vào giỏ hàng thành công");
  res.redirect("back");
};
// [GET] cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  
  const cart = await Cart.findOne({
    _id: cartId,
  });
  // console.log(cart)
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }
  
  // console.log(cart)

  res.render("client/page/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};
// [GET] cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  // console.log(productId)
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );
  req.flash("success", "Xóa thành công");
  res.redirect("back");
};
// [GET] cart/delete/:productId
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );
  req.flash("success", "Đã cập nhật số lượng");
  res.redirect("back");
};
