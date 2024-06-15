const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const SettingGeneral = require("../../models/settings-general.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreehHelper = require("../../helpers/createTree");

//[GET] /admin/setting/general
module.exports.general =async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})
    res.render("admin/page/setting/general",{
        pageTitle: "Cài đặt chung",
        settingGeneral:settingGeneral
    });
}
//[PATCH] /admin/setting/general
module.exports.generalPatch =async (req, res) => {
    if (req.file) {
        req.body.logo = `/uploads/${req.file.filename}`;
    }
    // console.log(req.body)
    const settingGeneral = await SettingGeneral.findOne({})
    if(settingGeneral){
        await SettingGeneral.updateOne({_id : settingGeneral.id},req.body)
    }else{
        const record = new SettingGeneral(req.body)
        await record.save()
    }
    
    req.flash("success","Cập nhật thành công")
    res.redirect("back")
}