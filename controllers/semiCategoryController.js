const Category = require("../models/SemiCategory");
const escape = require("escape-html");
const validation = require("../utils/validation");
const Product = require("../models/Product");

//show all categories controller
exports.getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(201).json({ categories });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

//search specific Category
exports.gethCategoryById = async (req, res) => {
	const idSearch = escape(req.params.id);
	try {
		const checkIdSearch = validation.addSlashes(idSearch);
		const category = await Category.findById(checkIdSearch);
		if (!category) return res.status(400).send("No Category Found !");
		res.status(200).json({ category });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

//add new product controller
exports.addNewCategory = async (req, res) => {
	const serialNumber = escape(req.body.serialNumber);
	const name = escape(req.body.name);
	try {
		const checkSerialNumber = validation.addSlashes(serialNumber);
		const checkName = validation.addSlashes(name);

		const categoryFound = await Category.findOne({
			serialNumber: checkSerialNumber,
		});
		if (categoryFound) {
			res.status(400).json({ message: "הקטגוריה קיימת במערכת" });
		}
		const category = new Category({
			serialNumber: checkSerialNumber,
			name: checkName,
			quantity: 0,
		});

		await category.save();
		res.status(201).json({ message: "קטגוריה נוספה בהצלחה" });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: err });
	}
};

//update Category Details
exports.updateCategory = async (req, res) => {
	const id = escape(req.params.id);
	const serialNumber = escape(req.body.serialNumber);
	const name = escape(req.body.name);

	let updatedCategory;
	try {
		const checkId = validation.addSlashes(id);
		const checkSerialNumber = validation.addSlashes(serialNumber);
		const checkName = validation.addSlashes(name);

		updatedCategory = await Category.findByIdAndUpdate(checkId, {
			serialNumber: checkSerialNumber,
			name: checkName,
		});

		if (!updatedCategory) {
			return res.status(401).json({ message: "לא נמצאה קטגוריה" });
		}
		updatedCategory = await updatedCategory.save();

		res.status(201).json({ message: "קטגוריה עודכנה בהצלחה" });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: err });
	}
};

//delete category controller
exports.deleteCategory = async (req, res) => {
	const id = escape(req.params.id);
	try {
		const checkId = validation.addSlashes(id);
		const categoryResult = await Category.findById(checkId);
		if (!categoryResult) {
			return res.status(404).json({ message: "לא נמצאה קטגוריה" });
		}
		if(categoryResult.quantity > 0){
			return res.status(401).json({message: "יש למחוק את המוצרים המשוייכים"});
		}
		await Category.findByIdAndDelete(checkId);
		res.status(200).json({ message: "נמחק בהצלחה" });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

//post product to category
exports.asignProductToCategory = async (req, res) => {
	const categoryId = escape(req.params.id);
	const productId = escape(req.params.productId);
	try {
		const checkCategoryId = validation.addSlashes(categoryId);
		const checkProductId = validation.addSlashes(productId);

		const category = await Category.findById(checkCategoryId);
		if (!category)
			return res.status(404).json({ message: " לא נמצאה קטגוריה" });

		const product = await Product.findById(checkProductId);
		if (!product) return res.status(404).json({ message: "לא נמצא מוצר" });

		if (product.inCategory)
			return res
				.status(400)
				.json({ message: "המוצר משוייך לקטגוריה אחרת" });

		const productExist = category.productList.find(
			(id) => id.toString() === checkProductId
		);

		if (productExist)
			return res.status(400).json({ message: "מוצר זה קיים בקטגוריה" });
		
		category.productList.push(product);

		let cntQuantity = category.quantity + 1;
		await Product.findByIdAndUpdate(checkProductId, {
			productId: cntQuantity,
			inCategory: true,
		});

		category.quantity = cntQuantity;
		await category.save();
		return res.status(201).json({ message: "שוייך בהצלחה" });
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
};

exports.deleteProductSemiCategory = async(req,res) => {
	const semiId = escape(req.params.semi_id);
	const productId = escape(req.params.product_id);
	try {
		const checkSemiId = validation.addSlashes(semiId);
		const checkProductId = validation.addSlashes(productId);

		const semiCategory = await Category.findById(checkSemiId);
		if(!semiCategory) return res.status(400).json({message: "קטגוריה לא קיימת"});
		
		const productExist = semiCategory.productList.find(
			(id) => id.toString() === checkProductId
		);
		if(!productExist) return res.status(400).json({message: "המוצר לא קיים בקטגוריה"});
		else semiCategory.productList.pull(checkProductId);

		const isFound = user.productList.find(
			(product) => product.id.toString() === checkProductId 
		);
		if(isFound) return res.status(400).json({message: "המחיקה נכשלה"});

		await Product.findByIdAndUpdate(checkProductId, {
            productId: 0,
            inCategory: false,
        });
		await semiCategory.save();
		return res.status(200).json({message: "נמחק בהצלחה", semiCategory});
	} catch(err){
		return res.status(400).json({message: err});
	}
};

