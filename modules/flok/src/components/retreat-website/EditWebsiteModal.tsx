import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useRetreat} from "../../pages/misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
  },
  textField: {
    minWidth: "320px",
    "&:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
}))

type EditWebsiteModalProps = {
  open: boolean
  handleClose: () => void
}
function EditWebsiteModal(props: EditWebsiteModalProps) {
  let retreat = useRetreat()
  let formik = useFormik({
    initialValues: {
      header_image_link: "",
      company_logo_link: "",
      website_name: "",
    },
    onSubmit: (values) => {
      console.log({
        ...values,
        retreat_id: retreat.id,
      })
    },
  })
  let classes = useStyles()
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update Website</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Box className={classes.body}>
            <TextField
              required
              value={formik.values.website_name}
              id={`website_name`}
              onChange={formik.handleChange}
              variant="outlined"
              label="Website Name"
              className={classes.textField}
            />
            <TextField
              value={formik.values.header_image_link}
              id={`header_image_link`}
              onChange={formik.handleChange}
              variant="outlined"
              label="Banner Image Link"
              className={classes.textField}
            />
            <TextField
              value={formik.values.company_logo_link}
              id={`company_logo_link`}
              onChange={formik.handleChange}
              variant="outlined"
              label="Logo Image"
              className={classes.textField}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default EditWebsiteModal
