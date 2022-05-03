import {Box, Button, makeStyles, TextField} from "@material-ui/core"
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
  // open: boolean
  // handleClose: () => void
}
function EditWebsiteForm(props: EditWebsiteModalProps) {
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
    <form onSubmit={formik.handleSubmit}>
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

      <Button color="primary">Cancel</Button>
      <Button type="submit" color="primary">
        Save
      </Button>
    </form>
  )
}
export default EditWebsiteForm
