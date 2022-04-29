import {Box, Button, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import {RouteComponentProps} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {useRetreat} from "./misc/RetreatProvider"

type CreateRetreatWebsiteProps = RouteComponentProps<{
  retreatIdx: string
}>
function CreateRetreatWebsite(props: CreateRetreatWebsiteProps) {
  let retreat = useRetreat()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
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
    <PageContainer>
      <PageSidenav retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div>
          <form onSubmit={formik.handleSubmit}>
            Create Website
            <Box>
              <TextField
                required
                value={formik.values.website_name}
                id={`website_name`}
                onChange={formik.handleChange}
                variant="outlined"
                label="Website Name"
              />
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
            </Box>
            <Button type="submit" color="primary">
              Save
            </Button>
          </form>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default CreateRetreatWebsite
