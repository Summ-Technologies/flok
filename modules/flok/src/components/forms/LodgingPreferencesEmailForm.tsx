import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import React from "react"
import * as yup from "yup"

export type LodgingPreferencesEmailFormValues = {email: string}

let LodgingPreferencesEmailFormSchema = yup.object().shape({
  email: yup.string().required().email(),
})

type LodgingPreferencesEmailFormProps = {
  submitValues: (values: LodgingPreferencesEmailFormValues) => void
}
export default function LodgingPreferencesEmailForm(
  props: LodgingPreferencesEmailFormProps
) {
  let formik = useFormik<LodgingPreferencesEmailFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: LodgingPreferencesEmailFormSchema,
    onSubmit: props.submitValues,
    validateOnMount: true,
  })
  return (
    <Dialog maxWidth="sm" open>
      <form onClick={formik.handleSubmit}>
        <DialogTitle>Plese input your email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let us know who to get back to with proposals!
          </DialogContentText>
          <TextField
            margin="dense"
            variant="outlined"
            type="email"
            label="Email"
            id="email"
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            error={formik.touched.email && formik.errors.email !== undefined}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formik.isValid}>
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
