const MainCategory = require("../models/MainCategory");
const escape = require("escape-html");
const validation = require("../utils/validation");
const SemiCategoryModel = require("../models/SemiCategory")

exports.getAllMainCategory = async (req, res) => {
	try {
		const categories = await MainCategory.find();
		res.status(201).json({ categories });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

exports.getMainCategoryById = async (req, res) => {
	const idSearch = escape(req.params.id);
	try {
		const checkIdSearch = validation.addSlashes(idSearch);
		const category = await MainCategory.findById(checkIdSearch);
		if (!category) return res.status(400).send("No Category Found !");
		res.status(200).json({ category });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

exports.addNewMainCategory = async (req, res) => {
	const categoryName = escape(req.body.name);
	try {
		const checkName = validation.addSlashes(categoryName);

		const mainCategoryFound = await MainCategory.findOne({
			name: checkName,
		});

		if (mainCategoryFound)
			return res.status(400).json({ message: "הקטגוריה קיימת במערכת" });

		const mainCategory = new MainCategory({
			name: checkName,
		});

		await mainCategory.save();
		return res.status(201).json({ message: "הקטגוריה נוספה בהצלחה" });
	} catch (err) {
		console.log(err);
		return res.status(400).json({ message: err });
	}
};

exports.deleteMainCategory = async (req, res) => {
	const id = escape(req.params.id);
	try {
		const checkId = validation.addSlashes(id);
		const mainCategoryResult = await MainCategory.findById(checkId);
		if (!mainCategoryResult) {
			return res.status(404).json({ message: "לא נמצאה קטגוריה ראשית" });
		}
		if (mainCategoryResult.semiCategoryList.length > 0) {
			return res.status(401).json({ message: "קיימות קטגוריות משוייכות" })
		}
		await MainCategory.findByIdAndDelete(checkId);
		res.status(200).json({ message: "הקטגוריה נמחקה בהצלחה" });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

exports.updateMainCategory = async (req, res) => {
	const id = escape(req.params.id);
	const name = escape(req.body.name);

	let updateMainCategory;

	try {
		const checkId = validation.addSlashes(id);
		const checkName = validation.addSlashes(name);

		updateMainCategory = await MainCategory.findByIdAndUpdate(checkId, {
			name: checkName
		});
		if (!updateMainCategory) {
			return res.status(401).json({ message: "לא נמצאה קטגוריה" });
		}
		await updateMainCategory.save();
		res.status(201).json({ message: "קטגוריה עודכנה בהצלחה" });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

exports.asignSemiCategoryToMainCategory = async (req, res) => {
	const mainCategoryId = escape(req.params.id);
	const semiCategoryId = escape(req.params.semiId);
	try {
		const checkMainId = validation.addSlashes(mainCategoryId);
		const checkSemiId = validation.addSlashes(semiCategoryId);

		const mainCategory = await MainCategory.findById(checkMainId);
		const semiCategory = await SemiCategoryModel.findById(checkSemiId);

		if (!mainCategory) {
			return res.status(404).json({ message: "לא נמצאה קטגוריה ראשית" })
		}
		if (!semiCategory) {
			return res.status(404).json({ message: "לא נמצאה קטגוריה משנית" });
		}
		if (semiCategory.inMainCategory) {
			return res.status(400).json({ message: "לא ניתן לשייך - הקטגוריה המשנית משוייכת לקטגוריה ראשית אחרת" });
		}
		const semiExist = mainCategory.semiCategoryList.find(
			(id) => id.toString() === checkSemiId
		);
		if (semiExist) {
			return res.status(400).json({ message: "הקטגוריה משוייכת לקטגוריה ראשית זו" });
		}
		mainCategory.semiCategoryList.push(semiCategory);
		await SemiCategoryModel.findByIdAndUpdate(checkSemiId, {
			inMainCategory: true
		});
		await mainCategory.save();
		res.status(201).json({ message: "השיוך בוצע בהצלחה" });
	} catch (err) {
		res.status(401).json({ message: err });
	}
};


