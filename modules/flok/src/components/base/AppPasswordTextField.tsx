import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {VisibilityOffRounded, VisibilityRounded} from "@material-ui/icons"
import React, {useState} from "react"

export class PasswordValidation {
  static loginValidationRegex: RegExp = /^(?!.* ).{5,}$/
  static loginErrorMessage: string =
    "Passwords have to be 5 characters without spaces"
  static validationRegex: RegExp =
    /(?!.* )(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/
  static errorMessage: string =
    "Passwords need 7 characters, with 1 uppercase, 1 lowercase and 1 digit."
}

export default function AppPasswordTextField(props: TextFieldProps) {
  let [showPassword, setShowPassword] = useState(false)
  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
