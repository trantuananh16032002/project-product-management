const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreehHelper = require("../../helpers/createTree");

//[GET] admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  // function createTree(arr, parentId=""){
  //     const tree = []
  //     arr.forEach(item => {
  //         if(item.parent_id === parentId){
  //             const newItem = item
  //             const children = createTree(arr,item.id)
  //             if(children.length > 0){
  //                 newItem.children = children
  //             }
  //             tree.push(newItem)
  //         }
  //     });
  //     return tree
  // }
  const records = await ProductCategory.find(find);
  const newRecords = createTreehHelper.tree(records);
  // .limit(objPagination.limitItems)
  // .skip(objPagination.skip)
  // .sort(sort);

  res.render("admin/page/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};
//[GET] admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const records = await ProductCategory.find(find);
  const newRecords = createTree(records);
  // console.log(newRecords)
  res.render("admin/page/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};
//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  // try {

  //     // Chuyển đổi các trường cần thiết sang kiểu số
  //     req.body.price = parseInt(req.body.price);
  //     req.body.discountPercentage = parseInt(req.body.discountPercentage);
  //     req.body.stock = parseInt(req.body.stock);

  //     // Nếu trường position không được nhập vào, thiết lập vị trí = số lượng sản phẩm + 1

  if (!req.body.position) {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1; // Thêm 1 để đặt vị trí mới
  } else {
    req.body.position = parseInt(req.body.position);
  }
  //     if(req.file){
  //         req.body.thumbnail =`/uploads/${req.file.filename}`
  //     }
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  // Tạo một sản phẩm mới từ dữ liệu form
  const record = new ProductCategory(req.body);

  // Lưu sản phẩm vào cơ sở dữ liệu
  await record.save();

  //     // Chuyển hướng về trang danh sách sản phẩm sau khi lưu thành công
  //     res.redirect('/admin/products');
  // } catch (error) {
  //     console.error('Error creating product:', error);
  //     // Nếu có lỗi, chuyển hướng về trang tạo sản phẩm với thông báo lỗi
  //     req.flash('error', 'Failed to create product. Please try again.');
  //     res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  // }

  // console.log(req.body)

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
//[GET] admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const data = await ProductCategory.findOne({
    _id: id,
    deleted: false
  })
  const records = await ProductCategory.find({
    deleted:false
  });
  const newRecords = createTreehHelper.tree(records);
  // console.log(newRecords)
  res.render("admin/page/products-category/edit", {
    pageTitle: "Chỉnh sửa danh mục sản phẩm",
    data: data,
    records: newRecords
  });
};
//[PATCH] admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  const id = req.params.id;
  req.body.position = parseInt(req.body.position)
  await ProductCategory.updateOne({_id: id},req.body)
  res.redirect("back")
};