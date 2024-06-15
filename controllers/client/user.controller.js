const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const tokenHelper = require("../../helpers/generate");
const generateHelper = require("../../helpers/generate");

const productsHelper = require("../../helpers/product");
const sendMailHelper = require("../../helpers/sendMail");


//[GET] user/register
module.exports.register = async (req, res) => {
  res.render("client/page/user/register", {
    pageTitle: "Đăng ký",
  });
};
//[POST] user/registerPost
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", `Email đã tồn tại`);
    res.redirect("back");
    return;
  }
  // req.body.token = tokenHelper.generateRandomString(20)
  async function generateUniqueToken() {
    let token;
    let tokenExists = true;
    while (tokenExists) {
      token = tokenHelper.generateRandomString(20);
      tokenExists = await User.findOne({ token });
    }
    return token;
  }
  req.body.token = await generateUniqueToken();
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  // console.log(user)
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
//[GET] user/login
module.exports.login = async (req, res) => {
  res.render("client/page/user/login", {
    pageTitle: "Đăng nhập",
  });
};
//[POST] user/loginPost
module.exports.loginPost = async (req, res) => {
  // console.log(req.body)
  const email = req.body.email;
  const passwrod = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Người dùng không tồn tại`);
    res.redirect("back");
    return;
  }
  if (md5(passwrod) != user.password) {
    req.flash("error", `Sai mật khẩu`);
    res.redirect("back");
    return;
  }
  if (user.active == "inactive") {
    req.flash("error", `Tài khoản đang bị khóa`);
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  //lưu user_id vào modelCart
  await Cart.updateOne({_id: req.cookies.cartId}, {
    user_id:user.id
  })

  res.redirect("/");
};
//[GET] user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
//[GET] user/password/forgot
module.exports.forgot = async (req, res) => {
  res.render("client/page/user/forgot", {
    pageTitle: "Quên mật khẩu",
  });
};
//[POST] user/password/forgot

module.exports.forgotPost = async (req, res) => {
  // req.body.email
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", `Email không tồn tại`);
    res.redirect("back");
    return;
  }
  //tạo mã otp, lưu otp và email vào collection
  const otp = generateHelper.generateRandomNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  // console.log(objectForgotPassword)

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //gửi mã qua mail
  const subject = `Mã OTP xác minh lây lại mật khẩu`;
  const html =`Mã OTP xác minh lấy lại mật khẩu là ${otp}`
  sendMailHelper.sendMail(email,subject,html)
  res.redirect(`/user/password/otp?email=${email}`);
};
//[GET] user/password/otp/email
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/page/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};
//[POST] user/password/otp/email
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", `OTP không hợp lệ`);
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email:email
  })
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
//[GET] user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/page/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    });
};
//[POST] user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    // console.log(password)
    // console.log(confirmPassword)
    const tokenUser = req.cookies.tokenUser
    // console.log(tokenUser)
    await User.updateOne(
        {
            tokenUser: tokenUser
        },
        {
            password: md5(password)
        }
    )
    req.flash("success","Đổi mật khẩu thành công")
    res.redirect("/")
};
//[GET] user/info
module.exports.info = async (req, res) => {
  res.render("client/page/user/info", {
      pageTitle: "Thông tin tài khoản",
  });
};
