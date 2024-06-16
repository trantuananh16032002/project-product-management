const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");

// [GET] admin/order/:id/confirm
module.exports.confirmOrder = async(req, res) => {
    const {id} = req.params;
    const order = await Order.findById(id);
    order.order_status = "Đã xác nhận";
    await order.save();
    req.flash("success", `Đã xác nhận đơn hàng #${id} thành công`);
    res.redirect("/admin/dashboard");
}

// [GET] admin/order/:id
module.exports.detailOrder = async(req, res) => {
    const {id} = req.params;
    const order = await Order.findById(id);

    // Attach product infor to order
    // Calculate newPrice, totalPrice
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id,
        });
        product.productInfo = productInfo;
        product.priceNew = productsHelper.priceNewProduct(product);
        product.totalPrice = product.priceNew * product.quantity;
    }

    res.render("admin/page/orders/detail",{order});
}