import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import React from "react"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {AppRoutes} from "../../Stack"
import {postHotel} from "../../store/actions/admin"
import {ApiAction} from "../../store/actions/api"
import {getTextFieldErrorProps} from "../../utils"
import AppLoadingScreen from "../base/AppLoadingScreen"
import DestinationSelect from "./DestinationSelect"

let useStyles = makeStyles((theme) => ({
  root: {
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
}))

type NewHotelFormProps = {}
export default function NewHotelForm(props: NewHotelFormProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let formik = useFormik({
    initialValues: {
      name: "",
      destination_id: "",
    },
    validationSchema: yup.object({
      name: yup.string().required().min(3),
      destination_id: yup.number().required("Destination is required"),
    }),
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(true)
      let newHotelResp = (await dispatch(
        postHotel(values as any)
      )) as unknown as ApiAction
      formikHelpers.setSubmitting(false)
      if (!newHotelResp.error && newHotelResp.payload.hotel) {
        dispatch(
          push(
            AppRoutes.getPath("HotelPage", {
              hotelId: newHotelResp.payload.hotel.id,
            })
          )
        )
      }
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} className={classes.root}>
      {formik.isSubmitting && <AppLoadingScreen />}
      <Typography variant="h4">Add a new hotel</Typography>
      <TextField
        fullWidth
        label="Hotel name"
        placeholder="Enter the new hotel's name"
        InputLabelProps={{shrink: true}}
        required
        {...formik.getFieldProps("name")}
        {...getTextFieldErrorProps(formik, "name")}
      />
      <DestinationSelect
        required
        {...formik.getFieldProps("destination_id")}
        {...getTextFieldErrorProps(formik, "destination_id")}
        onChange={(val) =>
          formik.setFieldValue(
            "destination_id",
            parseInt(val.target.value) ?? ""
          )
        }
      />
      <Box display="flex" flexDirection="row-reverse">
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  )
}
