const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoute = require('./api/routes/product');
// const categoryRoute = require('./api/routes/category');
const cartRoute = require('./api/routes/carts');
const url = require('url');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/myappDB');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
// app.use('/api/category', categoryRoute);

app.listen(PORT, () => {
    console.log(`Server listen from ${PORT}.....`);
});




