import {Form, formValidatorNonEmpty} from "../utils/formUtils"
export const StripeCheckoutForm: Form<
  "firstName" | "lastName" | "streetAddress" | "city" | "state" | "zipCode"
> = {
  firstName: {
    type: "text",
    validator: formValidatorNonEmpty(),
    value: "",
    label: "First name",
    required: true,
  },
  lastName: {
    type: "text",
    validator: formValidatorNonEmpty(),
    value: "",
    label: "Last name",
    required: true,
  },
  streetAddress: {
    type: "text",
    validator: formValidatorNonEmpty(),
    value: "",
    label: "Street address",
    required: true,
  },
  city: {
    type: "text",
    validator: formValidatorNonEmpty(),
    value: "",
    label: "City",
    required: true,
  },
  state: {
    type: "text",
    validator: formValidatorNonEmpty(),
    value: "",
    label: "State",
    required: true,
  },
  zipCode: {
    type: "text",
    validator: formValidatorNonEmpty(5),
    value: "",
    label: "Zip code",
    required: true,
  },
}
