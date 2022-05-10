import {Box, Button, makeStyles, TextField} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"
import {AppRoutes} from "../../Stack"
import {patchPage} from "../../store/actions/retreat"
import {useAttendeeLandingPage} from "../../utils/retreatUtils"

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
  saveButton: {
    marginTop: theme.spacing(2),
  },
}))

type EditPageFormProps = {
  pageId: number
  retreatIdx: string
  pageName: string
}

function EditPageForm(props: EditPageFormProps) {
  let dispatch = useDispatch()
  let classes = useStyles()
  let page = useAttendeeLandingPage(props.pageId)
  let disabledChange = page?.title.toLowerCase() === "home"
  let formik = useFormik({
    initialValues: {
      title: page?.title ?? "",
    },
    onSubmit: (values) => {
      dispatch(patchPage(props.pageId, values))
      dispatch(
        push(
          AppRoutes.getPath("LandingPageGeneratorConfig", {
            retreatIdx: props.retreatIdx.toString(),
            pageName: props.pageName,
          })
        )
      )
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.body}>
        <TextField
          required
          value={formik.values.title}
          id={`title`}
          onChange={formik.handleChange}
          variant="outlined"
          label="Page Name"
          className={classes.textField}
          disabled={disabledChange}
        />
        {!disabledChange && (
          <Button
            type="submit"
            color="primary"
            variant="contained"
            className={classes.saveButton}>
            Save
          </Button>
        )}
      </Box>
    </form>
  )
}
export default EditPageForm
