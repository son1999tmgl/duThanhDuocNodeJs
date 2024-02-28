import { checkSchema } from 'express-validator';
import { USERMESSAGES } from '~/constants/message';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';
import { validate } from '~/utils/validation';

export const loginValidate = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USERMESSAGES.INVALID_EMAIL_FORMAT
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value });
          if (!user) throw new Error(USERMESSAGES.USER_NOT_FOUND);
          req.user = user;
          return true;
        }
      }
    },
    password: {
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
    }
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
    password: {
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
    },
    confirm_password: {
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
    },
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
