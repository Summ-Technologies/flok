import {
  Button,
  Link,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {patchRetreatDetails} from "../../store/actions/admin"
import {getTextFieldErrorProps, useRetreat} from "../../utils"

let useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
    maxWidth: theme.breakpoints.values.lg,
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  footer: {
    paddingTop: theme.spacing(1),
  },
  textField: {},
}))

function AttendeesRegistrationFormIdForm(props: {retreatId: number}) {
  const {retreatId} = props
  let classes = useStyles(props)
  let dispatch = useDispatch()

  // Get retreat data
  let [retreat] = useRetreat(retreatId)

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      attendees_registration_form_id:
        retreat?.attendees_registration_form_id ?? "",
    },
    validationSchema: yup.object({
      attendees_registration_form_id: yup.string(),
    }),
    onSubmit: (values) => {
      retreat && dispatch(patchRetreatDetails(retreat.id, values))
    },
  })
  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
    fullWidth: true,
    className: classes.textField,
  }
  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Typography className={classes.header} variant="h4">
        Attendees Registration Google Form Id
      </Typography>
      <TextField
        {...commonTextFieldProps}
        id="attendees_registration_form_id"
        {...getTextFieldErrorProps(formik, "attendees_registration_form_id")}
        value={formik.values.attendees_registration_form_id}
        label=" Attendees Registration Form Id"
        helperText={
          formik.values.attendees_registration_form_id ? (
            <>
              Form link:{" "}
              <Link
                href={`https://docs.google.com/forms/d/e/${formik.values.attendees_registration_form_id}/viewform`}
                target="_blank">
                https://docs.google.com/forms/d/e/
                {formik.values.attendees_registration_form_id}/viewform
              </Link>
            </>
          ) : undefined
        }
      />
      <div className={classes.footer}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            _.isEqual(formik.initialValues, formik.values) || !formik.isValid
          }>
          Save State
        </Button>
      </div>
    </form>
  )
}
export default AttendeesRegistrationFormIdForm
