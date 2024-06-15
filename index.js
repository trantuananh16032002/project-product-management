const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');
require("dotenv").config();

// Tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3000; // Sử dụng port từ .env hoặc mặc định 3000

app.use(methodOverride('_method'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Khởi tạo thông báo express-flash
app.use(cookieParser('dfdsfsdfsdf'));
app.use(session({ cookie: { maxAge: 60000 }, secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());

//tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Kết nối cơ sở dữ liệu
const database = require("./config/database");
database.connect(); // Gọi hàm kết nối từ module database

// Định nghĩa các biến cục bộ
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin; // Biến cục bộ dùng trong các file Pug
app.locals.moment = moment; // Biến cục bộ dùng trong các file Pug


// Cấu hình ứng dụng Express
app.set('views', './views'); // Thiết lập thư mục chứa các template
app.set('view engine', 'pug'); // Thiết lập engine để render các file Pug
app.use(express.static("public")); // Thiết lập thư mục public để phục vụ các file tĩnh như hình ảnh, CSS, JavaScript

// Định tuyến
const route = require("./routes/client/index.route"); // Route client
const routeAdmin = require("./routes/admin/index.route"); // Route admin
routeAdmin(app); // Gọi hàm định tuyến cho admin
route(app); // Gọi hàm định tuyến cho client

// Lắng nghe cổng
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
