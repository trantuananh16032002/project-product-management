const express = require('express')
const multer  = require('multer')
const router = express.Router();
// const upload = multer({ storage: './public/uploads/' })
const storageMulter = require("../../helpers/storage")
const validate = require("../../validate/admin/product.validate");   
const upload = multer({ storage: storageMulter()})

const controller = require("../../controllers/admin/setting.controller")
router.get('/general', controller.general);
router.patch('/general',upload.single('logo'), controller.generalPatch);

module.exports = router;