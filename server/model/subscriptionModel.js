import { Schema, model } from 'mongoose';

const SubscriptionModel = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    plan: {
      type: String,
      enum: ['6 months', '1 year', 'temporary'],
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Subscription', SubscriptionModel);
