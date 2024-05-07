import { Schema, model } from 'mongoose';

const Role = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
      },
    ],
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
Role.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
  }
  this.slug = this.makeSlug();
  next();
});

// make slug
Role.methods.makeSlug = function () {
  return this.name.toLowerCase().split(' ').join('-');
};

export default model('Role', Role);
