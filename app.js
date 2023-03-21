require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");

const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const customCss = fs.readFileSync(
	process.cwd() + "/documentation/swagger.css",
	"utf8"
);

const swaggerDocument = require("./documentation/openapi.json");

const semiCategoryRouter = require("./routers/semiCategoryRouter");
const mainCategoryRouter = require("./routers/mainCategoryRouter");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const URI = process.env.URI;
const URL = process.env.URL;

mongoose.set("strictQuery", true);
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: URL }));

mongoose
	.connect(URI)
	.then(() => console.log("Connected to DataBase"))
	.catch((err) => console.log(err.message));

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, {
		customCss,
		customSiteTitle: "YadLeyadid",
	})
);

app.use("/api/main-category/", mainCategoryRouter);
app.use("/api/semi-category/", semiCategoryRouter);
app.use("/api/users/", userRouter);
app.use("/api/products/", productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("Connection Successful!");
});
