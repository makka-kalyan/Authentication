import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("email")
    .exists()
    .bail()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Enter valid email address"),
  body("name")
    .exists()
    .bail()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a String")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 to 50 character")
    .trim(),
  body("password")
    .exists()
    .bail()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be a String")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must be minimum 6 character long"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errors: errors.array(),
      });
      next();
    }
  },
];
