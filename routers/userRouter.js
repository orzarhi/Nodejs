const router = require("express").Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.delete("/delete/:id", userController.deleteUser);

router.get("/:id", userController.getUserById);

router.get("/find-by-username/:username", userController.getUserByUsername);

router.patch("/update-password/:id", userController.updatePassword);

router.post(
	"/add-product/:user_id/productId/:product_id",
	userController.addProductForUser
);

router.delete(
	"/delete-product/:user_id/productId/:product_id",
	userController.deleteProductUser
);

router.get("/user-list/:id", userController.getUserProducts);

module.exports = router;
