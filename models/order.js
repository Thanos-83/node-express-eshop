import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
