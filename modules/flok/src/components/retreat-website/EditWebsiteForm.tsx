import {
  Button,
  CircularProgress,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import _ from "lodash"
import {useState} from "react"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import config, {IMAGE_SERVER_BASE_URL_KEY} from "../../config"
import {ImageModel} from "../../models"
import {AppRoutes} from "../../Stack"
import {ApiAction} from "../../store/actions/api"
import {patchWebsite, postImage} from "../../store/actions/retreat"
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

type EditWebsiteFormProps = {
  websiteId: number
  retreatIdx: number
  currentPageId: string
}
function EditWebsiteForm(props: EditWebsiteFormProps) {
  let dispatch = useDispatch()
  let website = useAttendeeLandingWebsite(props.websiteId)
  let imageHolder: {[key: number]: ImageModel} = {}
  if (website?.banner_image) {
    imageHolder[website?.banner_image.id] = website?.banner_image
  }
  if (website?.logo_image) {
    imageHolder[website?.logo_image.id] = website?.logo_image
  }
  let [images, setImages] = useState<{[key: number]: ImageModel}>(imageHolder)
  async function handlePatchWebsite(values: {
    name: string
    banner_image_id: number
    logo_image_id: number
  }) {
    let patchWebsiteResponse = (await dispatch(
      patchWebsite(props.websiteId, values)
    )) as unknown as ApiAction
    if (!patchWebsiteResponse.error) {
      dispatch(
        push(
          AppRoutes.getPath("LandingPageGeneratorConfig", {
            retreatIdx: props.retreatIdx.toString(),
            currentPageId: props.currentPageId,
          })
        )
      )
    }
  }
  let formik = useFormik({
    initialValues: {
      banner_image_id: website?.banner_image?.id ?? -1,
      logo_image_id: website?.logo_image?.id ?? -1,
      name: website?.name ?? "",
    },
    onSubmit: (values) => {
      for (let k in values) {
        if (values[k as keyof typeof values] === -1) {
          delete values[k as keyof typeof values]
        }
      }
      handlePatchWebsite(values)
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
      <div className={classes.body}>
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
          value={images[formik.values.banner_image_id]}
          id="banner_image"
          handleChange={(image) => {
            formik.setFieldValue("banner_image_id", image.id)
            setImages({...images, [image.id]: image})
          }}
          headerText="Banner Image"
        />
        <UploadImage
          value={images[formik.values.logo_image_id]}
          id="logo_image"
          handleChange={(image) => {
            formik.setFieldValue("logo_image_id", image.id)
            setImages({...images, [image.id]: image})
          }}
          headerText="Logo Image"
        />
        {/* <UploadImage
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
        /> */}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.uploadButton}
          disabled={_.isEqual(formik.values, formik.initialValues)}>
          Save
        </Button>
      </div>
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
  loader: {
    height: 20,
  },
  imageUploadFlex: {display: "flex", alignItems: "center"},
}))
type UploadImageProps = {
  value: ImageModel | undefined
  handleChange: (image: ImageModel) => void
  id: string
  headerText: string
}

export function UploadImage(props: UploadImageProps) {
  const [loading, setLoading] = useState(false)
  let dispatch = useDispatch()
  var splitTest = function (str: string) {
    // @ts-ignore
    return str.split("\\").pop().split("/").pop()
  }
  async function handlePostImage(values: {file: any}) {
    setLoading(true)
    let returnValue = (await dispatch(
      postImage(values)
    )) as unknown as ApiAction
    setLoading(false)
    if (!returnValue.error) {
      props.handleChange(returnValue.payload.image as ImageModel)
    }
  }
  let classes = useImageStyles()
  return (
    <div className={classes.uploadImageContainer}>
      <Typography className={classes.header}>{props.headerText}</Typography>
      {loading ? (
        <CircularProgress size="20px" className={classes.loader} />
      ) : (
        <div className={classes.imageUploadFlex}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            component="label">
            Choose File
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              // value={props.value}
              // id={props.id}
              hidden
              onChange={(e) => {
                handlePostImage({file: "none"})
                let data = new FormData()
                data.append("file", e.target?.files![0])
                fetch(`${config.get(IMAGE_SERVER_BASE_URL_KEY)}/api/images`, {
                  body: data,
                  method: "POST",
                  mode: "cors",
                }).then((res) => console.log(res))
              }}
            />
          </Button>
          <Typography
            style={{
              width: 160,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}>
            {props.value?.image_url
              ? splitTest(props.value?.image_url)
              : "No file chosen"}
          </Typography>
        </div>
      )}
    </div>
  )
}
