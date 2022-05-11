import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import * as yup from "yup"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {UploadImage} from "../components/retreat-website/EditWebsiteForm"
import {AppRoutes} from "../Stack"
import {ApiAction} from "../store/actions/api"
import {postPage, postWebsite} from "../store/actions/retreat"
import {getTextFieldErrorProps} from "../utils"
import {useAttendeeLandingWebsite} from "../utils/retreatUtils"
import RedirectPage from "./misc/RedirectPage"
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
  },
  textField: {
    marginTop: theme.spacing(1),
  },
  form: {
    backgroundColor: "white",
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
  const website = useAttendeeLandingWebsite(retreat.website_id)
  if (website?.page_ids[0]) {
    return (
      <RedirectPage
        pageName="LandingPageGeneratorPage"
        pathParams={{
          retreatIdx: retreatIdx.toString(),
          currentPageId: website.page_ids[0].toString(),
        }}
      />
    )
  }
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
                className={classes.textField}
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
    </PageContainer>
  )
}
export default CreateRetreatWebsite
