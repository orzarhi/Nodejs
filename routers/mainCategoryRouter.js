const router = require("express").Router();
const mainCategoryController = require("../controllers/MainCategoryController");

router.get("/", mainCategoryController.getAllMainCategory);

router.get("/:id", mainCategoryController.getMainCategoryById);

router.post("/add", mainCategoryController.addNewMainCategory);

router.patch("/update/:id", mainCategoryController.updateMainCategory);

router.delete("/delete/:id", mainCategoryController.deleteMainCategory);

router.post(
	"/:id/asign-semi-category/:semiId",
	mainCategoryController.asignSemiCategoryToMainCategory
);

module.exports = router;
