//home
const express = require('express')
const router = express.Router();
// const upload = multer({ storage: './public/uploads/' })

const controller = require("../../controllers/admin/order.controller")
router.get('/:id/confirm', controller.confirmOrder);
router.get('/:id', controller.detailOrder);

module.exports = router;