const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    id:String,
    url:String,
    detailUrl:String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String
})

const Products = new mongoose.model("Products", ProductsSchema)

module.exports = Products;
