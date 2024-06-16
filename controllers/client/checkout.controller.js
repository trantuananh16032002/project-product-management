const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/product");

// [GET] /checkout
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
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/page/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};
// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  // console.log(req.body) Thông tin user gửi lên
  const userInfo = req.body;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  let products = [];
  for (const product of cart.products) {
    const objProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };
    const productInfo = await Product.findOne({
      _id: product.product_id,
    });

    if (productInfo && productInfo.stock < product.quantity) {
      cart.products = cart.products.filter(
        (item) => item.product_id != product.product_id
      );
      await cart.save();
      req.flash("error", `Sản phẩm ${productInfo.title} không đủ số lượng`);
      res.redirect("back");
      return;
    }

    objProduct.price = productInfo.price;
    objProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objProduct);
  }
  // console.log(products)
  //đối tượng order hoàn chỉnh
  objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  };
  const order = new Order(objectOrder)
  await order.save();
  //lưu thành công thì cập nhật lại giỏ hàng thành rỗng
  await Cart.updateOne({
    _id:cartId
  },{
    products: []
  }
)
  res.redirect(`/checkout/success/${order.id}`);
};
// [GET] /checkout/success/id
module.exports.success = async (req, res) => {
    // console.log(req.params.orderId)
    const order = await Order.findOne({
        _id:req.params.orderId
    })
    //duyệt qua quà danh mục đã mua
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")
        product.productInfo = productInfo
        product.priceNew = productsHelper.priceNewProduct(product)
        product.totalPrice = product.priceNew * product.quantity
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice,0)

    console.log(order)
    res.render("client/page/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order:order
    });

};