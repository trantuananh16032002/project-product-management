const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword
    let newPoducts = []
    if(keyword){
        const keywordRegex = new RegExp(keyword,"i");
        const products = await Product.find({
            title:keywordRegex,
            status:"active",
            deleted:false
        })
        newPoducts = productsHelper.priceNewProducts(products)
    }
    res.render("client/page/search/index", {
      pageTitle: "Kết quả tìm kiếm",
      keyword:keyword,
      products:newPoducts
    });
  };
  