import { Schema, model } from 'mongoose';

const channelModel = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// add slug before save
channelModel.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
  }
  this.slug = this.makeSlug();
  next();
});

// make slug
channelModel.methods.makeSlug = function () {
  return this.name.toLowerCase().split(' ').join('-');
};

export default model('Channel', channelModel);
