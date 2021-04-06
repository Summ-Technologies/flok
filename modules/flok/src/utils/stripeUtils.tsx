import {loadStripe, Stripe} from "@stripe/stripe-js"
import config, {STRIPE_KEY} from "../config"

let stripePromise: Promise<Stripe | null>
export function useStripePromise() {
  if (!stripePromise) {
    stripePromise = loadStripe(config.get(STRIPE_KEY))
  }
  return stripePromise
}
