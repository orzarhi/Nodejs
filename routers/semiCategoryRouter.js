const router = require("express").Router();
const categoryController = require("../controllers/SemiCategoryController");

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.gethCategoryById);

router.post("/add", categoryController.addNewCategory);

router.patch("/update/:id", categoryController.updateCategory);

router.delete("/delete/:id", categoryController.deleteCategory);

router.post(
	"/:id/asign-category/:productId",
	categoryController.asignProductToCategory
);

module.exports = router;
