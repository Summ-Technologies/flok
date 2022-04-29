import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useRetreat} from "../../pages/misc/RetreatProvider"

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
      //convert from editor state to current content
      console.log({
        ...values,
        retreat_id: retreat.id,
      })
    },
  })
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create Retreat Website</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <Box>
            <TextField
              value={formik.values.header_image_link}
              id={`header_image_link`}
              onChange={formik.handleChange}
              variant="outlined"
              label="Banner Image Link"
            />
            <TextField
              value={formik.values.company_logo_link}
              id={`company_logo_link`}
              onChange={formik.handleChange}
              variant="outlined"
              label="Logo Image"
            />
            <TextField
              required
              value={formik.values.website_name}
              id={`website_name`}
              onChange={formik.handleChange}
              variant="outlined"
              label="Website Name"
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
