//home
const express = require('express')
const multer  = require('multer')
const router = express.Router();
// const upload = multer({ storage: './public/uploads/' })
const storageMulter = require("../../helpers/storage")
const validate = require("../../validate/admin/product.validate");   
const upload = multer({ storage: storageMulter()})


const controller = require("../../controllers/admin/product.controller")
router.get('/', controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'),validate.creatPost,controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single('thumbnail'),
    controller.editPatch
    );
router.get("/detail/:id", controller.detail);

module.exports = router;