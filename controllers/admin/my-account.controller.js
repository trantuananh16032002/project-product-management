const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreehHelper = require("../../helpers/createTree");
const md5 = require("md5");

//[GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/page/my-account/index", {
    pageTitle: "Danh sách tài khoản",
  });
};
//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/page/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

//[PATCH] /admin/my-account/editPatch
module.exports.editPatch = async (req, res) => {
  if (req.file) {
  req.body.avatar = `/uploads/${req.file.filename}`;
  }
  // console.log(req.body)
  id = res.locals.user.id
  // console.log(id)
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }
  
  console.log(req.body)
  await Account.updateOne({ _id: id},req.body);
  req.flash("success", "Cập nhật thành công");
  res.redirect("back");
};