import { Request, Response, NextFunction } from "express" 
import { body, validationResult } from "express-validator"

const validateCredentials = [
        body("email")
            .trim()
            .notEmpty().withMessage("Email cannot be empty")
            .isEmail().withMessage("Not a valid email"),
        body("password")
            .trim()
            .notEmpty().withMessage("Password cannot be empty")
            .isLength({min: 4, max: 10}).withMessage("Password is an invalid length of characters"),
        (req : Request, res : Response, next : NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({validationErrors: errors})
                return;
            }
            next();
        }
]

export default validateCredentials