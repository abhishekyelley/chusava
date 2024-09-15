
interface BaseMessage {
  message: string;
}

interface BaseError extends BaseMessage {
  error: true;
}

interface ValidationError<T> extends BaseError {
  type: "validation";
  location: keyof T;
}

interface AuthenticationError extends BaseError {
  type: "authentication";
}

interface SuccessMessage extends BaseMessage {
  type: "success";
}

export type Message<T> = SuccessMessage | ValidationError<T> | AuthenticationError;

interface BaseAuthFields {
  email: string;
  password: string;
}

export interface SignupFields extends BaseAuthFields {
  username: string;
  confirm_password: string;
}

export interface LoginFields { }

export interface BaseAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  formAction: (formData: FormData) => void;
  formState: Message<SignupFields> | undefined;
}

export interface SignupFormProps extends BaseAuthFormProps { }

export interface LoginFormProps extends BaseAuthFormProps { }