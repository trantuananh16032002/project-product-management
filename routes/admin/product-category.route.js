//home
const express = require('express')
const multer  = require('multer')
const router = express.Router();
// const upload = multer({ storage: './public/uploads/' })
const storageMulter = require("../../helpers/storage")
const validate = require("../../validate/admin/product.validate");   
const upload = multer({ storage: storageMulter()})

const controller = require("../../controllers/admin/product-category.controller")

router.get('/', controller.index);
router.get('/create', controller.create);
router.post("/create", upload.single('thumbnail'),validate.creatPost,controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',upload.single('thumbnail'),validate.creatPost, controller.editPatch);
module.exports = router;