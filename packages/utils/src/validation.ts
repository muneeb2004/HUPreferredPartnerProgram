export const isValid = (_val: unknown): boolean => true;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
export const PASSWORD_REGEX_MESSAGE = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
