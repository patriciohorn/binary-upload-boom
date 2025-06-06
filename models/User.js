const bcrypt = require('bcrypt'); // library to help us hash passwords
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

// Password hash middleware, when creating a user??
UserSchema.pre('save', async function save(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    next();
  } catch (error) {
    return next(error);
  }
});

// Helper method for validating user's password.
UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  try {
    const isMatch = await bcrypt.compare(
      candidatePassword,
      this.password
    );

    return isMatch;
  } catch (error) {
    throw error;
  }
};

// To use our schema, we need to convert it into a Model we can work with
// mongoose.model(modelName, schema)
module.exports = mongoose.model('User', UserSchema);
