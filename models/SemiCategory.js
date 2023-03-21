const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const semiCategorySchema = new Schema(
  {
    serialNumber: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    quantity: {
      type: Number,
      trim: true,
      default: 0
    },
    inMainCategory: {
      type: Boolean,
      default: false
    },
    productList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SemiCategorySchema = mongoose.model("semi-category", semiCategorySchema);
module.exports = SemiCategorySchema;
