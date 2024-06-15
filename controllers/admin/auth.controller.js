const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreehHelper = require("../../helpers/createTree");
const md5 = require("md5");

// [GET] admin/auth/login
module.exports.login = (req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }else{
        res.render("admin/page/auth/login",{
            pageTitle: "Trang đăng nhập"
        });
    }
    
}
// [POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    const user = await Account.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        console.log("âsasasa")
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return
    }
    if(md5(password) !== user.password){
        req.flash("error", "Mật khẩu không chính xác")
        res.redirect("back")
        return
    }
    if(user.status !== "active"){
        req.flash("error", "Tài khoản đã bị khóa")
        res.redirect("back")
        return
    }
    res.cookie("token",user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}
// [GET] admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}