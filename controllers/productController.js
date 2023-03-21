const Product = require("../models/Product");
const escape = require("escape-html");
const validation = require("../utils/validation");
const { sendMail } = require("./sendMail");

exports.getProducts = async (req, res) => {
	try {
		const product = await Product.find();
		return res.status(200).send(product);
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
};

exports.addProduct = async (req, res) => {
	const productName = escape(req.body.productName);
	let product;
	try {
		if (!productName) {
			return res.status(400).json({ message: "יש למלא את השדות" });
		}

		const checkProductName = validation.addSlashes(productName);

		product = new Product({
			productName: checkProductName,
		});
		await product.save();
		res.status(201).json(product);
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
};

exports.getProductById = async (req, res) => {
	const productId = escape(req.params.id);
	let product;
	try {
		const checkProductId = validation.addSlashes(productId);
		product = await Product.findById(checkProductId);
		if (!product) return res.status(404).json({ message: "מוצר לא קיים" });
		return res.status(200).json(product);
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

exports.deleteProduct = async (req, res) => {
	const productId = escape(req.params.id);
	let product;
	try {
		const checkProductId = validation.addSlashes(productId);
		product = await Product.findById(checkProductId);
		if (!product) return res.status(404).json({ message: "מוצר לא קיים" });
		if (product.inCategory == true) {
			return res
				.status(401)
				.json({ message: "לא ניתן למחוק - משוייך לקטגוריה" });
		}
		if (product.place == "מושאל" || product.place == "בתיקון") {
			return res
				.status(401)
				.json({ message: "לא ניתן למחוק - המוצר לא במלאי" });
		}
		await Product.findByIdAndDelete(checkProductId);
		return res.status(200).json({ message: "המוצר נמחק בהצלחה" });
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

exports.updateProduct = async (req, res) => {
	const productId = escape(req.params.id);
	const productName = escape(req.body.productName);

	let updateProduct;
	try {
		const checkId = validation.addSlashes(productId);
		const checkProductName = validation.addSlashes(productName);

		updateProduct = await Product.findByIdAndUpdate(checkId, {
			productName: checkProductName,
		});
		if (!updateProduct)
			return res.status(401).json({ message: "מוצר לא קיים" });

		updateProduct = await updateProduct.save();
		return res.status(201).json({ message: "המוצר התעדכן בהצלחה" });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};
