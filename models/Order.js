import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  lessonIDs: [String],
  numberOfSpaces: Number
});
export default mongoose.model("Order", orderSchema);
