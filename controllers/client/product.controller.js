const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")

const productsHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/product-category");


//[GET /products/]
module.exports.index =async (req, res) => {
    let products = await Product.find({
        deleted: false,
        status:"active"
    }).sort({position:"desc"}); // Sử dụng lean() để nhận được các đối tượng JavaScript thuần túy

    // Tính toán giá mới cho mỗi sản phẩm
    const newProducts = productsHelper.priceNewProducts(products)

    // console.log(products);

    // Render template với dữ liệu sản phẩm
    res.render("client/page/products/index", {
        pageTitle: "Danh sách sản phẩm trang client",
        products: newProducts
    });
}

// [GET /products/detail/:slugProduct]
module.exports.detail =async (req, res) => {
    // console.log(req.params.slug)
    const find = {
        deleted:false,
        slug:req.params.slugProduct,
        status: "active"
    }
    const product = await Product.findOne(find)
    //lưu info category vào product
    if(product.product_category_id){
        const category = await ProductCategory.findOne({
            _id: product.product_category_id,
            status: "active",
            deleted:false
        });
        product.category = category
    }
    //new price
    product.priceNew = productsHelper.priceNewProduct(product)
    // console.log(product)
    res.render("client/page/products/detail", {
        pageTitle: "Chi tiết sản phẩm trang client",
        product: product
    });
}
// [GET /products/:slugCategory]
module.exports.category =async (req, res) => {
    console.log(req.params.slugCategory)
    //truy vấn sản phẩm danh mục
    const category = await ProductCategory.findOne({
        slug:req.params.slugCategory,
        status:"active",
        deleted:false
    })
    // console.log(category) //id danh mục
    // console.log(category.id) //id danh mục

    //lấy ra các sản phẩm danh mục cha- cha con
    // const getSubCategory = async (parentId) =>{
    //     const subs = await ProductCategory.find({
    //         parent_id: parentId,
    //         status:"active",
    //         deleted:false
    //     });
    //     let allSub = [...subs];
    //     for (const sub of subs) {
    //         const childs = await getSubCategory(sub.id);
    //         allSub = allSub.concat(childs)
    //     }
    //     return allSub;
    // }

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)
    const listSubCategoryId = listSubCategory.map(item => item.id)


    const products = await Product.find({
        product_category_id : {$in: [category.id, ...listSubCategoryId]},
        deleted:false
    }).sort({position: "desc"})
    console.log(products)
    const newProducts = productsHelper.priceNewProducts(products)

    res.render("client/page/products/index", {
        pageTitle: category.title,
        status:"active",
        products: newProducts
    });
}
