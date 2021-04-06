export class FormUtils<FormFieldNames extends string> {
  static validateEmail(email: string): FormFieldValidationResponse {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(email)) {
      return "Invalid email address"
    }
  }

  static passwordValidator(authType: "signup" | "signin") {
    return (password: string): FormFieldValidationResponse => {
      if (!password) {
        return "Password is required"
      }
      if (password.length < 5) {
        return "Password is too short"
      } else if (
        (password.toLowerCase() === password ||
          password.toUpperCase() === password) &&
        authType === "signup"
      ) {
        return "Password needs at least one lower and one upper case character"
      }
    }
  }

  validateForm(form: Form<FormFieldNames>): FormFieldValidationResponse[] {
    return Object.keys(form)
      .map((fieldName) => {
        let field = form[fieldName as FormFieldNames]
        if (field.required) return field.validator(field.value, form)
      })
      .filter((x) => x)
  }

  getTextErrorProps(
    form: Form<FormFieldNames>,
    key: FormFieldNames
  ): {error?: boolean; helperText?: string} {
    let _error: {error?: boolean; helperText?: string} = {}
    let formField = form[key]
    let validator = formField ? formField.validator : undefined
    let value = formField ? formField.value : undefined
    if (validator) {
      let error = validator(value, form)
      if (error) {
        _error.error = true
        _error.helperText = error
      }
    }
    return _error
  }
}

//////// Typing

export type Form<FormFieldNames extends string> = Record<
  FormFieldNames,
  FormField<FormFieldNames>
>

type FormField<
  FormFieldNames extends string = string,
  type = string,
  ValueType = any
> = {
  type: type
  value: ValueType
  label?: string
  required?: boolean
  validator: (
    val: ValueType,
    form: Form<FormFieldNames>
  ) => FormFieldValidationResponse
}

// if 'undefined', validation passed
// if 'string', validation failed and 'string' is the reasons
type FormFieldValidationResponse = string | undefined

export type TextFormField<FormFieldNames extends string> = FormField<
  FormFieldNames,
  "text",
  string
>

// Validators

export function formValidatorNonEmpty(
  n: number = 0,
  customMessage?: string
): (val: string) => FormFieldValidationResponse {
  let errMessage = customMessage ? customMessage : "Input too short"
  return (val: string) => {
    return val && val.length > n ? undefined : errMessage
  }
}
