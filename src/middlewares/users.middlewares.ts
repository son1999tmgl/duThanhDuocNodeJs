import { NextFunction, Request, Response } from 'express';
import { ParamSchema, checkSchema } from 'express-validator';
import { isEmpty } from 'lodash';
import { UserVerifyStatus } from '~/constants/enum';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERMESSAGES } from '~/constants/message';
import { ErrorWithStatus } from '~/models/Errors';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';
import { hasPassword256 } from '~/utils/crypto';
import { verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERMESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERMESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 20
    },
    errorMessage: USERMESSAGES.PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_20
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERMESSAGES.PASSWORD_STRONG_REQUIREMENTS
  }
};

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERMESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERMESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 20
    },
    errorMessage: USERMESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_20
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERMESSAGES.PASSWORD_CONFIRMATION_MISMATCH);
      }
      return true;
    },
    errorMessage: USERMESSAGES.PASSWORD_CONFIRMATION_MISMATCH
  }
};

const forgotPasswrodSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERMESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const decoded_forgot_passwrod_authorization = await verifyToken({
        token: value,
        secretOnPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
      });
      (req as Request).decoded_forgot_passwrod_authorization = decoded_forgot_passwrod_authorization;
      return true;
    }
  }
};

export const loginValidate = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USERMESSAGES.INVALID_EMAIL_FORMAT
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({
            email: value,
            password: hasPassword256(req.body.password)
          });
          if (!user) throw new Error(USERMESSAGES.USER_NOT_FOUND);
          (req as Request).user = user;
          return true;
        }
      }
    },
    password: passwordSchema
  })
);

export const registerValidate = validate(
  checkSchema({
    name: {
      isLength: {
        options: {
          min: 1,
          max: 20
        },
        errorMessage: USERMESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_20
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERMESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERMESSAGES.INVALID_EMAIL_FORMAT
      },
      trim: true,
      custom: {
        options: async (value) => {
          const result = await userServices.checkEmailExists(value);
          if (result) throw new Error(USERMESSAGES.EMAIL_ALREADY_EXISTS);
          return result;
        },
        errorMessage: USERMESSAGES.EMAIL_ALREADY_EXISTS
      }
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    date_of_birth: {
      notEmpty: {
        errorMessage: USERMESSAGES.DATE_OF_BIRTH_IS_REQUIRED
      },
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USERMESSAGES.INVALID_DATE_FORMAT
      }
    }
  })
);
export const accessTokenValidate = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: USERMESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const access_token: string = value.replace('Bearer ', '');
            if (!access_token) throw new Error(USERMESSAGES.ACCESS_TOKEN_IS_REQUIRED);
            const decoded_authorization = await verifyToken({
              token: access_token,
              secretOnPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
            });
            (req as Request).decoded_authorization = decoded_authorization;
            return true;
          }
        }
      }
    },
    ['headers']
  )
);
export const refreshTokenValidate = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USERMESSAGES.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            try {
              if (!value) throw new Error(USERMESSAGES.REFRESH_TOKEN_IS_REQUIRED);
              const [decoded_refresh_authorization, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOnPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ]);
              if (refresh_token === null) {
                throw new ErrorWithStatus({ message: 'Refresh token ko tồn tại', status: HTTP_STATUS.UNAUTHORIZED });
              }
              return true;
            } catch (error) {
              throw new ErrorWithStatus({ message: 'Refresh token ko đúng', status: HTTP_STATUS.UNAUTHORIZED });
            }
          }
        }
      }
    },
    ['body']
  )
);

export const verifyEmailTokenValidate = validate(
  checkSchema(
    {
      verify_email_token: {
        notEmpty: {
          errorMessage: USERMESSAGES.VERIFY_EMAIL_TOKEN_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const decoded_refresh_authorization = await verifyToken({
              token: value,
              secretOnPublicKey: process.env.JWT_SECRET_VERIFY_EMAIL_TOKEN as string
            });
            (req as Request).decoded_email_verify_token = decoded_refresh_authorization;
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export const forgotPasswrordValidate = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERMESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERMESSAGES.INVALID_EMAIL_FORMAT
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value });
            if (!user) {
              throw new Error(USERMESSAGES.USER_NOT_FOUND);
            }
            (req as Request).user = user;
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswrodSchema
    },
    ['body']
  )
);

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isLength: {
          options: {
            min: 1,
            max: 20
          },
          errorMessage: USERMESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_20
        },
        trim: true
      },
      date_of_birth: {
        optional: true,
        notEmpty: {
          errorMessage: USERMESSAGES.DATE_OF_BIRTH_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: USERMESSAGES.INVALID_DATE_FORMAT
        }
      },
      bio: {
        optional: true,
        isLength: {
          options: {
            max: 255
          },
          errorMessage: USERMESSAGES.BIO_LENGTH_MUST_BE_LESS_THAN_255
        }
      },
      location: {
        optional: true,
        isLength: {
          options: {
            max: 50
          },
          errorMessage: USERMESSAGES.LOCATION_LENGTH_MUST_BE_LESS_THAN_50
        }
      },
      website: {
        optional: true,
        isURL: {
          errorMessage: USERMESSAGES.INVALID_URL_FORMAT
        }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: USERMESSAGES.USERNAME_MUST_BE_STRING
        }
      },
      avatar: {
        optional: true,
        isURL: {
          errorMessage: USERMESSAGES.INVALID_URL_FORMAT
        }
      },
      cover_photo: {
        optional: true,
        isURL: {
          errorMessage: USERMESSAGES.INVALID_URL_FORMAT
        }
      }
    },
    ['body']
  )
);

export const resetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswrodSchema,
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
);

export const verifyUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const verify = req.decoded_authorization?.verify;
  if (!verify || verify !== UserVerifyStatus.Verified)
    throw new ErrorWithStatus({ message: USERMESSAGES.INSUFFICIENT_PERMISSIONS, status: HTTP_STATUS.UNAUTHORIZED });
  next();
};
