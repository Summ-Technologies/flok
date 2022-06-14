import {Button, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"

function CreateHotelGroupForm() {
  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      console.log(values)
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} style={{display: "flex"}}>
      <TextField
        onChange={formik.handleChange}
        id="title"
        label="Grouping Title"
      />
      <Button type="submit" variant="outlined">
        Submit
      </Button>
    </form>
  )
}
export default CreateHotelGroupForm
