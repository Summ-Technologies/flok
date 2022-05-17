import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import * as yup from "yup"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {UploadImage} from "../components/retreat-website/EditWebsiteForm"
import {ImageModel} from "../models"
import {AppRoutes} from "../Stack"
import {ApiAction} from "../store/actions/api"
import {postPage, postWebsite} from "../store/actions/retreat"
import {getTextFieldErrorProps} from "../utils"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(1),
  },
  form: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(1),
  },
}))
type CreateRetreatWebsiteProps = RouteComponentProps<{
  retreatIdx: string
}>
function CreateRetreatWebsite(props: CreateRetreatWebsiteProps) {
  let retreat = useRetreat()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let classes = useStyles()
  let dispatch = useDispatch()
  let [images, setImages] = useState<{[key: number]: ImageModel}>({})
  async function handleCreateWebsite(values: {
    name: string
    retreat_id: number
  }) {
    let websiteResponse = (await dispatch(
      postWebsite(values)
    )) as unknown as ApiAction
    if (!websiteResponse.error) {
      let pageResponse = (await dispatch(
        postPage({
          title: "Home",
          website_id: websiteResponse.payload.website.id,
        })
      )) as unknown as ApiAction
      if (!pageResponse.error) {
        dispatch(
          push(
            AppRoutes.getPath("LandingPageGeneratorPage", {
              retreatIdx: retreatIdx.toString(),
              currentPageId: pageResponse.payload.page.id,
            })
          )
        )
      }
    }
  }

  let formik = useFormik({
    initialValues: {
      banner_image_id: -1,
      logo_image_id: -1,
      name: "",
    },
    onSubmit: (values) => {
      for (let k in values) {
        if (values[k as keyof typeof values] === -1) {
          delete values[k as keyof typeof values]
        }
      }
      handleCreateWebsite({
        ...values,
        retreat_id: retreat.id,
      })
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

  return (
    <PageContainer>
      <PageSidenav retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.root}>
          <Typography variant="h1">Create a Website</Typography>
          <form onSubmit={formik.handleSubmit} className={classes.form}>
            <Box className={classes.body}>
              <TextField
                required
                value={formik.values.name}
                id={`name`}
                onChange={formik.handleChange}
                variant="outlined"
                label="Website Name"
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
            </Box>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.submitButton}
              disabled={formik.values.name === ""}>
              Create
            </Button>
          </form>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default CreateRetreatWebsite
