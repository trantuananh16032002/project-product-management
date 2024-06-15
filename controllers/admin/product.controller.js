const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreehHelper = require("../../helpers/createTree");

//[GET] admin/products
module.exports.index = async (req, res) => {
  //khoi tao doi tuong tim kiem find
  let find = {
    deleted: false,
  };

  //Bộ lọc trạng thái thẻ button
  const filterStatus = filterStatusHelper(req.query); //tra ve mang filter: đói tượng đại diện button Tất cả/Hoạt động/ Ngưng hoạt động
  //gồm name/status/class
  // console.log(filterStatus);
  if (req.query.status) {
    //nếu trạng thái có tồn tại
    find.status = req.query.status; //thêm status vào đối tượng find
    //in ra sản phẩm với status=?
  }
  //End Bộ lọc trạng thái thẻ button

  //SEARCH
  const objSearch = searchHelper(req.query);
  // console.log(objSearch)
  // console.log(objSearch.keyword)

  if (objSearch.regex) {
    find.title = objSearch.regex;
  }
  // let keyword = ""
  // if(req.query.keyword){
  //     keyword = req.query.keyword
  //     const regex = new RegExp(keyword,"i")
  //     find.title = regex;
  // }
  //End SEARCH

  //Pagination

  const countProducts = await Product.countDocuments(find); // Sử dụng countDocuments thay vì count
  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // if(req.query.page){
  //     objPagination.currentPage = parseInt(req.query.page)
  // }
  // console.log(objPagination.currentPage)
  // objPagination.skip = (objPagination.currentPage - 1)*objPagination.limitItems
  // console.log(objPagination.skip)

  // Tính số lượng sản phẩm
  // const countProducts = await Product.countDocuments(find); // Sử dụng countDocuments thay vì count
  // console.log(countProducts);

  // const totalPage = Math.ceil(countProducts/objPagination.limitItems)
  // objPagination.totalPage = totalPage
  // console.log(totalPage);

  //Pagination

  //sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  //render
  const products = await Product.find(find)
    .limit(objPagination.limitItems)
    .skip(objPagination.skip)
    .sort(sort); //{position: "desc"}
  // console.log(products);

  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
  }

  res.render("admin/page/products/index", {
    pageTitle: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
    Pagination: objPagination,
  });
};
//[PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  //[GET] admin/products/change-status/:status/:id
  console.log(req.params); // trả về 1 obj {status:... , id: ...}
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect("back");
};
//[PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  console.log(req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};
//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.deleteOne({ _id: id });
  req.flash("success", `Xóa thành công sản phẩm`);
  res.redirect("back");
};
//[GET] admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);
  const newCategory = createTreehHelper.tree(category);
  res.render("admin/page/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};
//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    // Chuyển đổi các trường cần thiết sang kiểu số
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    // Nếu trường position không được nhập vào, thiết lập vị trí = số lượng sản phẩm + 1
    if (!req.body.position) {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1; // Thêm 1 để đặt vị trí mới
    } else {
      req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    // Tạo một sản phẩm mới từ dữ liệu form
    const product = new Product(req.body);
    // Lưu sản phẩm vào cơ sở dữ liệu
    await product.save();

    // Chuyển hướng về trang danh sách sản phẩm sau khi lưu thành công
    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error creating product:", error);
    // Nếu có lỗi, chuyển hướng về trang tạo sản phẩm với thông báo lỗi
    req.flash("error", "Failed to create product. Please try again.");
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }
};
//[GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const product = await Product.findOne(find);

  const category = await ProductCategory.find({
    deleted: false,
  });
  const newCategory = createTreehHelper.tree(category);

  res.render("admin/page/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    category: newCategory,
  });
};
//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    // Chuyển đổi các trường cần thiết sang kiểu số
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    // Nếu trường position không được nhập vào, thiết lập vị trí = số lượng sản phẩm + 1
    if (!req.body.position) {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1; // Thêm 1 để đặt vị trí mới
    } else {
      req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cập nhật thành công");
    // Chuyển hướng về trang danh sách sản phẩm sau khi lưu thành công
    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error creating product:", error);
    // Nếu có lỗi, chuyển hướng về trang tạo sản phẩm với thông báo lỗi
    req.flash("error", "Failed to create product. Please try again.");
    res.redirect("back");
  }
};
//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const product = await Product.findOne(find);

  res.render("admin/page/products/detail", {
    pageTitle: product.title,
    product: product,
  });
};
