import { body, validationResult } from "express-validator";

export const registerValidation = [
  body("email")
    .exists()
    .withMessage("Emial is required")
    .isEmail()
    .withMessage("Inavlis Email Address"),
  body("phone")
    .exists()
    .withMessage("Phone Number is Required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Phone Number"),
  body("password")
    .exists()
    .withMessage("password is required")
    .trim()
    .length({ min: 6 })
    .withMessage("password atleast 6 character long"),
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
