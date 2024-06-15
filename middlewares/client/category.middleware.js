const ProductCategory = require("../../models/product-category.model");
const createTreehHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    deleted: false,
  });
  const newProductsCategory = createTreehHelper.tree(productsCategory);
  // console.log(newProductsCategory)
  res.locals.layoutProductsCategory = newProductsCategory;
  next();
};
