import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {useFormik} from "formik"
import {useRetreat} from "../../pages/misc/RetreatProvider"
import BeforeUnload from "../base/BeforeUnload"

let useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
  },
  textField: {
    minWidth: "200px",
    "&:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
  uploadButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
      header_image: "",
      company_logo: "",
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
        <BeforeUnload
          when={formik.values !== formik.initialValues}
          message="Are you sure you wish to leave without saving your changes?"
        />
        <TextField
          required
          value={formik.values.website_name}
          id={`website_name`}
          onChange={formik.handleChange}
          variant="outlined"
          label="Website Name"
          className={classes.textField}
        />
        <UploadImage
          value={formik.values.header_image}
          id="header_image"
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              // formik.setFieldValue("header_image", e.target.files[0])
              console.log(e.target.files[0])
            }
          }}
          headerText="Header Image"
        />
        <UploadImage
          value={formik.values.company_logo}
          id="company_logo"
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              // in practice we need to dispatch action to send image to image server, then use the response to update the website object which will trigger a change to the formik object
              formik.setFieldValue(
                "company_logo",
                JSON.stringify(e.target.files[0])
              )
              console.log(e.target.files[0])
            }
          }}
          headerText="Company Logo"
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

let useImageStyles = makeStyles((theme) => ({
  uploadImageContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))
type UploadImageProps = {
  value: any
  handleChange: any
  id: string
  headerText: string
}

function UploadImage(props: UploadImageProps) {
  let classes = useImageStyles()
  return (
    <div className={classes.uploadImageContainer}>
      <Typography className={classes.header}>{props.headerText}</Typography>
      <input
        type="file"
        accept="image/png, image/gif, image/jpeg"
        value={props.value}
        id={props.id}
        onChange={props.handleChange}
      />
    </div>
  )
}
