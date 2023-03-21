const router = require("express").Router();
const productController = require("../controllers/ProductController");

router.get("/", productController.getProducts);

router.post("/add-product", productController.addProduct);

router.get("/:id", productController.getProductById);

router.delete("/delete/:id", productController.deleteProduct);

router.patch("/update/:id", productController.updateProduct);

module.exports = router;
