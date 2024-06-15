const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const tokenHelper = require("../../helpers/generate");
const systemConfig = require("../../config/system");
const createTreehHelper = require("../../helpers/createTree");
const md5 = require("md5");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");
  // console.log(records)
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/page/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};
//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/page/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  });
};
// //[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  // console.log(req.body)
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (req.file) {
    req.body.avatar = `/uploads/${req.file.filename}`;
  }
  if (emailExist) {
    res.flash("error", "Email đã tồn tại");
    res.redirect("back");
  } else {

    req.body.token = tokenHelper.generateRandomString(20)
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  let find = {
    _id: id,
    deleted: false,
  };
  const data = await Account.findOne(find);
  // console.log(data)
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/page/accounts/edit", {
    pageTitle: "Sửa nhóm quyền",
    data: data,
    roles: roles,
  });
};
// //[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    _id: {$ne: id},
    email: req.body.email,
    deleted: false,
  });

  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }
  
  await Account.updateOne(
    {
      _id: id
    },
    req.body
  );
  req.flash("success", "Cập nhật thành công");

  res.redirect("back");
};
// //[GET] /admin/roles/permissions
// module.exports.permissions =async (req, res) => {
//     let find = {
//         deleted:false
//     }
//     const records = await Role.find(find)
//     res.render("admin/page/roles/permissions",{
//         pageTitle: "Phân quyền",
//         records:records
//     });
// }
// //[PATCH] /admin/roles/permissions
// module.exports.permissionsPatch =async (req, res) => {
//     // console.log(req.body.permissions)
//     const permissions = JSON.parse(req.body.permissions);
//     for (const item of permissions) {
//         // const id = item.id
//         // const permissions = item.permissions
//         await Role.updateOne({_id:item.id},{permissions:item.permissions})
//     }
//     req.flash("success","Cập nhật phân quyền thành công")
//     res.redirect("back")
// }
