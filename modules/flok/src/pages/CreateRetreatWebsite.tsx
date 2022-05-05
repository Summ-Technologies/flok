import {Box, Button, makeStyles, TextField, Typography} from "@material-ui/core"
import {useFormik} from "formik"
import {RouteComponentProps} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import RedirectPage from "./misc/RedirectPage"
import {useRetreat} from "./misc/RetreatProvider"

type CreateRetreatWebsiteProps = RouteComponentProps<{
  retreatIdx: string
}>
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
function CreateRetreatWebsite(props: CreateRetreatWebsiteProps) {
  let retreat = useRetreat()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let classes = useStyles()
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
  if (true) {
    return (
      <RedirectPage
        pageName="LandingPageGeneratorPage"
        pathParams={{retreatIdx: retreatIdx.toString(), pageName: "home"}}
      />
    )
  }
  console.log(retreat)
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
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.submitButton}>
              Save
            </Button>
          </form>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default CreateRetreatWebsite
