import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {AppRoutes} from "../../Stack"
import {ApiAction} from "../../store/actions/api"
import {patchWebsite} from "../../store/actions/retreat"
import {getTextFieldErrorProps} from "../../utils"
import {useAttendeeLandingWebsite} from "../../utils/retreatUtils"

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
  websiteId: number
  retreatIdx: number
  pageName: string
}
// take in website id and usewebsite

function EditWebsiteForm(props: EditWebsiteModalProps) {
  let dispatch = useDispatch()
  let website = useAttendeeLandingWebsite(props.websiteId)

  async function handlePatchWebsite(values: {name: string}) {
    let patchWebsiteResponse = (await dispatch(
      patchWebsite(props.websiteId, values)
    )) as unknown as ApiAction
    if (!patchWebsiteResponse.error) {
      dispatch(
        push(
          AppRoutes.getPath("LandingPageGeneratorConfig", {
            retreatIdx: props.retreatIdx.toString(),
            pageName: props.pageName,
          })
        )
      )
    }
  }
  let formik = useFormik({
    initialValues: {
      header_image: "",
      company_logo: "",
      name: website?.name ?? "",
    },
    onSubmit: (values) => {
      handlePatchWebsite({name: formik.values.name})
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required()
        .matches(
          /^[aA-zZ\s0-9]+$/,
          "Can only contain letters, numbers, or spaces"
        ),
    }),
  })
  let classes = useStyles()
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.body}>
        {/* <BeforeUnload
          when={formik.values !== formik.initialValues}
          message="Are you sure you wish to leave without saving your changes?"
        /> */}
        <TextField
          required
          value={formik.values.name}
          id={`name`}
          onChange={formik.handleChange}
          variant="outlined"
          label="Website Name"
          className={classes.textField}
          {...getTextFieldErrorProps(formik, "name")}
        />
        <UploadImage
          value={formik.values.header_image}
          id="header_image"
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              formik.setFieldValue("header_image", e.target.value)
              // console.log(e.target.files[0])
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
              formik.setFieldValue("company_logo", e.target.value)
              // (e.target.files[0])
            }
          }}
          headerText="Company Logo"
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.uploadButton}
          disabled={_.isEqual(formik.values, formik.initialValues)}>
          Save
        </Button>
      </Box>
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

export function UploadImage(props: UploadImageProps) {
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
