/*
 * name validation
 * accepted: letters & spaces, minimum 3 chars, maximum 15 chars
 */
export const confirmPassword: RegExp = /[a-zA-Z\ ]{3,15}/;

/*
 * email validation
 */
export const email: RegExp = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;
export const score: RegExp = /^[0-9\b]+$/;
export const InputSore: RegExp = /^[0-9\b]+$/;

/*
 * password validation, should contain:
 * (?=.*\d): at least one digit
 * (?=.*[a-z]): at least one lower case
 * (?=.*[A-Z]): at least one uppercase case
 * [0-9a-zA-Z]{6,}: at least 6 from the mentioned characters
 */
export const password: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
