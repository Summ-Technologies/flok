import {Button, makeStyles, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"
import {postHotelGroup} from "../../store/actions/admin"

let useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
  },
}))
type CreateHotelGroupFormProps = {
  retreatId: number
}
function CreateHotelGroupForm(props: CreateHotelGroupFormProps) {
  let classes = useStyles()
  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      dispatch(postHotelGroup({...values, retreat_id: props.retreatId}))
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} className={classes.form}>
      <TextField
        onChange={formik.handleChange}
        id="title"
        label="Grouping Title"
      />
      <Button type="submit" variant="outlined" color="primary">
        Submit
      </Button>
    </form>
  )
}
export default CreateHotelGroupForm
