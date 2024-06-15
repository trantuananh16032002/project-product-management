const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");

// [GET] /home
module.exports.index = async (req, res) => {
  //render ra file html index.pug (khi render hien tai dang default o views

  // START lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured) //sản phẩm nổi bật + tính lại giá
  // END lấy ra sản phẩm nổi bật

  //START lấy ra ds sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({position: "desc"});

  const newProductsNew = productsHelper.priceNewProducts(productsNew) //sản phẩm mới + tính lại giá
  //END lấy ra ds sản phẩm mới nhất

  res.render("client/page/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,//sản phẩm nổi bật
    productsNew:newProductsNew
  });
};
