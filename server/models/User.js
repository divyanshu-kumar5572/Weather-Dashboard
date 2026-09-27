// server/models/User.js

// 1. Import mongoose, the library we will use to define our Schema and Model.
import mongoose from 'mongoose';

// 2. Define the User Schema using `new mongoose.Schema()`.
//    This object defines the structure and rules for our user documents.
const userSchema = new mongoose.Schema(
  {
    // The 'email' field definition.
    email: {
      type: String,     // The data type is a string.
      required: true,   // This field must be provided to create a user.
      unique: true,     // No two documents in the collection can have the same email.
      lowercase: true,  // Mongoose will automatically convert the email to lowercase.
    },
    // The 'password' field definition.
    password: {
      type: String,     // The data type is a string.
      required: true,   // A password is required.
    },
  },
  {
    // 3. Schema options object.
    //    `timestamps: true` tells Mongoose to automatically add and manage
    //    `createdAt` and `updatedAt` fields for each document.
    timestamps: true,
  }
);

// 4. Compile the schema into a model.
//    The `mongoose.model()` function takes two arguments:
//    a) The singular name of the model as a string, e.g., 'User'. Mongoose will
//       automatically create a MongoDB collection named 'users' (plural and lowercase).
//    b) The schema to use for the model, which is `userSchema` in our case.
const User = mongoose.model('User', userSchema);

// 5. Export the User model as the default export from this module.
//    This allows us to import and use it in other parts of our backend,
//    such as our upcoming authentication routes.
export default User;