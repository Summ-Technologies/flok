import {Box, Button, makeStyles, TextField} from "@material-ui/core"
import {useFormik} from "formik"

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
}))
function EditPageForm() {
  let formik = useFormik({
    initialValues: {
      page_name: "",
    },
    onSubmit: (values) => {
      console.log(values)
    },
  })
  let classes = useStyles()
  return (
    <form onSubmit={formik.handleSubmit}>
      {/* <BeforeUnload
        when={formik.values !== formik.initialValues}
        message="Are you sure you wish to leave without saving your changes"
      /> */}
      <Box className={classes.body}>
        <TextField
          required
          value={formik.values.page_name}
          id={`page_name`}
          onChange={formik.handleChange}
          variant="outlined"
          label="Page Name"
          className={classes.textField}
        />
        <Button type="submit" color="primary">
          Save
        </Button>
      </Box>
    </form>
  )
}
export default EditPageForm
