import {Button, makeStyles, TextField} from "@material-ui/core"
import {useFormik} from "formik"

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
  pages: any
}
function AddPageForm(props: AddPageFormProps) {
  let classes = useStyles()
  let formik = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      console.log(values)
    },
  })
  let disabledAdd: boolean =
    props.pages.map((page: any) => page.title).includes(formik.values.title) ||
    formik.values.title === ""
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
