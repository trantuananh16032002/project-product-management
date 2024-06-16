const systemConfig = require("../../config/system")
const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const roleRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const authRoutes = require("./auth.route")
const myAccountRoutes = require("./my-account.route")   
const settingRoutes = require("./setting.route")   
const orderRoutes = require("./order.route")

const authMiddleWare = require("../../middlewares/admin/auth.middleware")




module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN+'/dashboard',authMiddleWare.requiredAuth, dashboardRoutes);//neu duong dan la path_admin thi router dashboardRoutes se xu li
    app.use(PATH_ADMIN+'/products',authMiddleWare.requiredAuth, productRoutes);
    app.use(PATH_ADMIN+'/products-category',authMiddleWare.requiredAuth, productCategoryRoutes);
    app.use(PATH_ADMIN+'/roles',authMiddleWare.requiredAuth, roleRoutes);
    app.use(PATH_ADMIN+'/accounts',authMiddleWare.requiredAuth, accountRoutes);
    app.use(PATH_ADMIN+'/auth', authRoutes);
    app.use(PATH_ADMIN+'/my-account',authMiddleWare.requiredAuth, myAccountRoutes);
    app.use(PATH_ADMIN+'/setting',authMiddleWare.requiredAuth, settingRoutes);
    app.use(PATH_ADMIN+'/orders',authMiddleWare.requiredAuth, orderRoutes)
}