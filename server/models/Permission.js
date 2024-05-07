import { Schema, model } from 'mongoose';

const Permission = Schema(
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
Permission.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
  }
  this.slug = this.makeSlug();
  next();
});

// make slug
Permission.methods.makeSlug = function () {
  return this.name.toLowerCase().split(' ').join('-');
};

export default model('Permission', Permission);
