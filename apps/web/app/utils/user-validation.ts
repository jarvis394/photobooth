import { z } from 'zod'
import parsePhoneNumberFromString from 'libphonenumber-js'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@valley/shared'

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20

export const UsernameSchema = z
  .string({ error: 'Username is required' })
  .min(USERNAME_MIN_LENGTH, { error: 'Username is too short' })
  .max(USERNAME_MAX_LENGTH, { error: 'Username is too long' })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: 'Username can only include letters, numbers, and underscores',
  })
  // users can type the username in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase())

export const passwordMinLengthError = `Your password must contain ${PASSWORD_MIN_LENGTH} or more characters`
export const PasswordSchema = z
  .string({
    error: passwordMinLengthError,
  })
  .min(PASSWORD_MIN_LENGTH, {
    error: passwordMinLengthError,
  })
  .max(PASSWORD_MAX_LENGTH, { error: 'Password is too long' })
export const NameSchema = z
  .string({ error: 'Field is required' })
  .min(3, { error: 'Value is too short' })
  .max(16, { error: 'Value is too long' })
export const FullnameSchema = z
  .string({ error: 'Field is required' })
  .min(6, { error: 'Value is too short' })
  .max(32, { error: 'Value is too long' })
export const EmailSchema = z
  .email({ error: 'Email is invalid' })
  .min(3, { error: 'Email is too short' })
  .max(100, { error: 'Email is too long' })
  // users can type the email in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase())

export const PhoneSchema = z.string().transform((arg, ctx) => {
  const phone = parsePhoneNumberFromString(arg, {
    defaultCountry: 'RU',
    // Set to false to require that the whole string is exactly a phone number,
    // otherwise, it will search for a phone number anywhere within the string
    extract: false,
  })

  if (phone && phone.isValid()) {
    return phone.number
  }

  ctx.addIssue({
    code: 'custom',
    message: 'Invalid phone number',
  })
  return z.NEVER
})
