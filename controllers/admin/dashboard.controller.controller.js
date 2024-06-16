const Order = require("../../models/order.model");

module.exports.dashboard = async(req, res) => {
    // Find waitingConfirmOrders don't have order_status or order_status is "Chờ xác nhận"
    const waitingConfirmOrders = await Order.find({
        $or: [
            {order_status: null},
            {order_status: "Chờ xác nhận"}
        ],
    });

    console.log(waitingConfirmOrders);

    // Calculate total price each waitingConfirmOrders
    for (const order of waitingConfirmOrders) {
        let totalPrice = 0;
        for (const product of order.products) {
            totalPrice += product.price * product.quantity * (1 - product.discountPercentage / 100);
        }
        order.totalPrice = totalPrice;
    }

    res.render("admin/page/dashboard/index",{
        pageTitle: "Trang tong quan",
        waitingConfirmOrders
    });
}