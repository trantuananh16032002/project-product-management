//home
const express = require('express')
const multer  = require('multer')
const router = express.Router();
// const upload = multer({ storage: './public/uploads/' })
const storageMulter = require("../../helpers/storage")
const validate = require("../../validate/admin/account.validate");   
const upload = multer({ storage: storageMulter()})

const controller = require("../../controllers/admin/account.controller")
router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',upload.single('avatar'),validate.creatPost, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',upload.single('avatar'),validate.creatPatch, controller.editPatch);
// router.get('/permissions', controller.permissions);
// router.patch('/permissions', controller.permissionsPatch);

module.exports = router;