import mongoose from "mongoose"; // Use import instead of require
import jwt from "jsonwebtoken"; // Use import instead of require
import Joi from "joi"; // Use import instead of require
import passwordComplexity from "joi-password-complexity"; // Use import instead of require

const userSchema = new mongoose.Schema({
    Orgname: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Added unique constraint
    password: { type: String, required: true },
    Orgname: { type: String, required: false },
});

// Define the method to generate the JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

// Create the User model
const User = mongoose.model("User", userSchema); // Changed the model name to "User" (capitalize)

// Validation function
const validate = (data) => {
    const schema = Joi.object({
        FirstName: Joi.string().required().label("First Name"),
        LastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        Orgname: Joi.string().label("Organization Name"),
    });
    return schema.validate(data);
};

// Export the User model and validate function
export { User, validate };
