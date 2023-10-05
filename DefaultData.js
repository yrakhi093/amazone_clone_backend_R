const Products = require("./model/ProductsSchema");
const ProductsData = require("./ProductsData");

const DefaultData = async ()=>{
    try {

        await Products.deleteMany({})
        const storeData = await Products.insertMany(ProductsData)
        // console.log(storeData);
    } catch (error) {
        console.log("error"+error.message)
    }

}

module.exports = DefaultData;