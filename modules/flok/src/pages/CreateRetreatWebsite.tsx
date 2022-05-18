import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import * as yup from "yup"
import PageBody from "../components/page/PageBody"
import {UploadImage} from "../components/retreat-website/EditWebsiteForm"
import {AppRoutes} from "../Stack"
import {ApiAction} from "../store/actions/api"
import {postInitialWebsite, postPage} from "../store/actions/retreat"
import {getTextFieldErrorProps} from "../utils"
import {useAttendeeLandingWebsite} from "../utils/retreatUtils"
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
  let [retreat, retreatIdx] = useRetreat()
  let classes = useStyles()
  let website = useAttendeeLandingWebsite(retreat.attendees_website_id ?? -1)
  let dispatch = useDispatch()
  useEffect(() => {
    if (website && !website.page_ids[0]) {
      dispatch(
        postPage({
          title: "Home",
          website_id: website.id,
        })
      )
    }
  }, [dispatch, website])

  async function handleCreateWebsite(values: {
    name: string
    retreat_id: number
  }) {
    let websiteResponse = (await dispatch(
      postInitialWebsite(values)
    )) as unknown as ApiAction
    if (!websiteResponse.error) {
      dispatch(
        push(
          AppRoutes.getPath("LandingPageGeneratorPage", {
            retreatIdx: retreatIdx.toString(),
            currentPageId: websiteResponse.payload.page.id,
          })
        )
      )
    }
  }

  let formik = useFormik({
    initialValues: {
      header_image: "",
      company_logo: "",
      name: "",
    },
    onSubmit: (values) => {
      handleCreateWebsite({
        name: values.name,
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
              value={formik.values.header_image}
              id="header_image"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  // formik.setFieldValue("header_image", e.target.files[0])
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
                  formik.setFieldValue("company_logo", e.target.value)
                  // (e.target.files[0])
                }
              }}
              headerText="Company Logo"
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
  )
}
export default CreateRetreatWebsite
