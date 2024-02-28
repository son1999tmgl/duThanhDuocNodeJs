import HTTP_STATUS from '~/constants/httpStatus';
import { USERMESSAGES } from '~/constants/message';

type ErrorsType = Record<
  string,
  {
    msg: string;
    [key: string]: any;
  }
>;

export class ErrorWithStatus {
  message: string;
  status: number;
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message;
    this.status = status;
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType;
  constructor({
    message = USERMESSAGES.VALIDATION_ERROR,
    status = HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errors
  }: {
    message?: string;
    status?: number;
    errors: any;
  }) {
    super({ message, status });
    this.errors = errors;
  }
}
