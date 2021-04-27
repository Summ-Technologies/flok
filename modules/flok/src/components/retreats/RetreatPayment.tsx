import {Box, StandardProps} from "@material-ui/core"
import {
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import {SyntheticEvent, useState} from "react"
import {StripeCheckoutForm} from "../../models/forms"
import {useStripePromise} from "../../utils/stripeUtils"
import AppStripeCCForm from "../AppStripeCCForm"

interface RetreatPaymentProps extends StandardProps<{}, "root"> {}

function RetreatPaymentBody(props: RetreatPaymentProps) {
  let stripe = useStripe()
  let elements = useElements()
  let [form, setForm] = useState<typeof StripeCheckoutForm>(StripeCheckoutForm)

  let clientSecret =
    "pi_1IbLKLKlwU4zujMbXWllllUV_secret_w4CgE3SXk0w0gyAh5dUXjzSLl"

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Disable form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardNumberElement = elements.getElement(CardNumberElement)
    if (cardNumberElement) {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {card: cardNumberElement},
      })
    }
  }

  return (
    <Box>
      <AppStripeCCForm handleSubmit={handleSubmit} />
    </Box>
  )
}

interface RetreatPaymentProps extends StandardProps<{}, "root"> {}

export default function RetreatPayment(
  props: React.PropsWithChildren<RetreatPaymentProps>
) {
  let stripePromise = useStripePromise()

  return (
    <Elements stripe={stripePromise}>
      <RetreatPaymentBody />
    </Elements>
  )
}
