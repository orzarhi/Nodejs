exports.adminOnly = async (req, res, next) => {
	const user = req.user;
	if (user.isAdmin) return next();

	return res.status(401).json({ message: "איזור מנהלים בלבד" });
};
