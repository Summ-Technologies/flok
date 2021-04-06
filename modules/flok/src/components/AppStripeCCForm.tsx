import {Box, Grid, InputBase, makeStyles} from "@material-ui/core"
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js"
import React, {
  PropsWithChildren,
  SyntheticEvent,
  useMemo,
  useState,
} from "react"
import config, {GOOGLE_API_KEY} from "../config"
import {StripeCheckoutForm} from "../models/forms"
import {useScript} from "../utils"
import {FormUtils} from "../utils/formUtils"
import AppButton from "./AppButton"
import GoogleAutocomplete from "./base/GoogleAutocomplete"

const STRIPE_STYLE = {
  fontSize: "16px",
  letterSpacing: "0",
  fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
  "::placeholder": {
    color: "#CFD7E0",
  },
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxWidth: 450,
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
  inputContainer: {
    width: "100%",
    boxShadow: theme.shadows[1],
    border: 0,
    outline: 0,
    backgroundColor: "white",
  },
  input: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontSize: 16,
    letterSpacing: 0,
    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
  },
  inputRoot: {
    width: "100%",
    "& *::placeholder": {
      color: "#CFD7E0",
      opacity: 1,
    },
  },
}))

function CardInfo() {
  let classes = useStyles()
  function StripeElement(props: PropsWithChildren<{}>) {
    return (
      <Box className={classes.inputContainer} padding={1}>
        {props.children}
      </Box>
    )
  }
  return (
    <>
      <Grid item xs={12}>
        <label>Card Info</label>
      </Grid>
      <Grid item xs={12}>
        <StripeElement>
          <CardNumberElement
            options={{showIcon: true, style: {base: STRIPE_STYLE}}}
          />
        </StripeElement>
      </Grid>
      <Grid item xs={6}>
        <StripeElement>
          <CardExpiryElement options={{style: {base: STRIPE_STYLE}}} />
        </StripeElement>
      </Grid>
      <Grid item xs={6}>
        <StripeElement>
          <CardCvcElement options={{style: {base: STRIPE_STYLE}}} />
        </StripeElement>
      </Grid>
    </>
  )
}

function BillingDetails(props: {submit: (id: string) => void}) {
  let classes = useStyles()
  let [form, setForm] = useState<typeof StripeCheckoutForm>(StripeCheckoutForm)
  type StripeCheckoutFormKeys = keyof typeof StripeCheckoutForm
  let checkoutFormUtils = new FormUtils<StripeCheckoutFormKeys>()

  return (
    <>
      <Grid item xs={12}>
        <label>Billing details</label>
      </Grid>
      <Grid item xs={6}>
        <Box className={classes.inputContainer}>
          <InputBase
            placeholder="First Name"
            classes={{input: classes.input, root: classes.inputRoot}}
            value={form.firstName.value}
            onChange={(e) =>
              setForm({
                ...form,
                firstName: {...form.firstName, value: e.target.value},
              })
            }
            required
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box className={classes.inputContainer}>
          <InputBase
            placeholder="Last Name"
            classes={{input: classes.input, root: classes.inputRoot}}
            value={form.lastName.value}
            onChange={(e) =>
              setForm({
                ...form,
                lastName: {...form.lastName, value: e.target.value},
              })
            }
            required
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <GoogleAutocomplete
          placesType="address"
          renderInput={(params) => (
            <Box className={classes.inputContainer}>
              <InputBase
                placeholder="Street address"
                autoComplete="false"
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                classes={{input: classes.input, root: classes.inputRoot}}
                onChange={(e) =>
                  setForm({
                    ...form,
                    streetAddress: {
                      ...form.streetAddress,
                      value: e.target.value,
                    },
                  })
                }
                required
              />
            </Box>
          )}
          onSelectLocation={(l) => {
            props.submit(l.placeId)
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Box className={classes.inputContainer}>
          <InputBase
            placeholder="City"
            classes={{input: classes.input, root: classes.inputRoot}}
            value={form.city.value}
            required
            onChange={(e) =>
              setForm({
                ...form,
                city: {...form.city, value: e.target.value},
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box className={classes.inputContainer}>
          <InputBase
            placeholder="State"
            classes={{input: classes.input, root: classes.inputRoot}}
            value={form.state.value}
            required
            onChange={(e) =>
              setForm({...form, state: {...form.state, value: e.target.value}})
            }
          />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box className={classes.inputContainer}>
          <InputBase
            placeholder="Zip"
            classes={{input: classes.input, root: classes.inputRoot}}
            value={form.zipCode.value}
            required
            onChange={(e) =>
              setForm({
                ...form,
                zipCode: {...form.zipCode, value: e.target.value},
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <AppButton
          style={{marginLeft: "auto"}}
          type="submit"
          disabled={checkoutFormUtils.validateForm(form).length > 0}>
          Pay
        </AppButton>
      </Grid>
    </>
  )
}

let googleService = {current: undefined}

type AppStripeCCFormProps = {
  handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => any
  disabled?: boolean
}

export default function AppStripeCCForm(
  props: PropsWithChildren<AppStripeCCFormProps>
) {
  const classes = useStyles(props)
  let {handleSubmit} = props
  let [googleMapScript] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${config.get(
      GOOGLE_API_KEY
    )}&libraries=places`
  )

  const fetch = useMemo(
    () => (request: {placeId: string}, callback: (result?: any[]) => void) => {
      ;(googleService.current as any).getDetails(
        {...request, fields: ["address_components"]},
        (results: any) => callback(results)
      )
    },
    []
  )

  function getPlaceDetails(placeId: string) {
    if (!googleService.current && googleMapScript) {
      let google: any = (window as any).google
      googleService.current = new google.maps.places.PlacesService(
        document.getElementById("google-attribution")
      )
    }

    if (!googleService.current) {
      return undefined
    }

    fetch({placeId}, (result) => {})
  }

  return (
    <form
      onSubmit={(e: SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}
      className={`${classes.root}`}>
      <Grid container spacing={2}>
        <CardInfo />
        <BillingDetails submit={getPlaceDetails} />
        <div id="google-attribution"></div>
      </Grid>
    </form>
  )
}
