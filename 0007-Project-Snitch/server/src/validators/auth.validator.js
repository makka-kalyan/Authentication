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
    }
    next();
  },
];

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .isString()
    .withMessage("Email must be a String Value")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be a string value")
    .bail()
    .trim()
    .isLength({ min: 6 })
    .withMessage("password at least 6 character long"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid data",
        errors: errors.array(),
      });
    }
    next();
  },
];
