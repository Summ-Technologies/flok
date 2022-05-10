import {Button, makeStyles, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"
import {postPage} from "../../store/actions/retreat"

let useStyles = makeStyles((theme) => ({
  addNew: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
}))
type AddPageFormProps = {
  website_id: number
}
function AddPageForm(props: AddPageFormProps) {
  let classes = useStyles()
  let dispatch = useDispatch()
  let formik = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      dispatch(postPage({...values, website_id: props.website_id}))
    },
  })
  let disabledAdd: boolean = formik.values.title === ""
  return (
    <form onSubmit={formik.handleSubmit} className={classes.addNew}>
      <TextField
        variant="outlined"
        value={formik.values.title}
        id="title"
        onChange={formik.handleChange}
        label="New Page Title"
        size="small"
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={disabledAdd}
        size="small">
        Add New Page
      </Button>
    </form>
  )
}
export default AddPageForm
