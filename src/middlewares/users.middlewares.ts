import { NextFunction, Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import userServices from '~/services/users.services';
import { validate } from '~/utils/validation';

export const loginValidate = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    });
  }
  next();
};

export const registerValidate = validate(
  checkSchema({
    name: {
      isLength: {
        options: {
          min: 1,
          max: 20
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const result = await userServices.checkEmailExists(value);
          if (result) throw new Error('Email already exists');
          return result;
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 20
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage:
          'The isStrongPassword string configuration has been set with the following options: minimum length of 6 characters, at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol. Any error messages will be provided as needed.'
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 20
        }
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
          }
          return true;
        }
      }
    },
    date_of_birth: {
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
);
