import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {postDestination} from "../../store/actions/admin"

let useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2),
  },
}))

type AddDestinationModalProps = {
  open: boolean
  onClose: () => void
}

function AddDestinationModal(props: AddDestinationModalProps) {
  let dispatch = useDispatch()
  let classes = useStyles()
  const [inUS, setInUS] = useState(true)
  let formik = useFormik({
    initialValues: {
      location: "",
      country: "United States",
      country_abbreviation: "USA",
      state: "",
      state_abbreviation: "",
    },
    onSubmit: (values) => {
      let submissionValues: {
        location: string
        country: string
        country_abbreviation?: string
        state?: string
        state_abbreviation?: string
      } = values
      if (!inUS) {
        delete submissionValues.state
        delete submissionValues.state_abbreviation
      }
      dispatch(postDestination(submissionValues))
      formik.resetForm()
      setInUS(true)
      props.onClose()
    },
  })
  let setFieldValue = formik.setFieldValue
  useEffect(() => {
    if (inUS) {
      setFieldValue("country", "United States")
      setFieldValue("country_abbreviation", "USA")
    } else {
      setFieldValue("country", "")
      setFieldValue("country_abbreviation", "")
    }
  }, [inUS, setFieldValue])

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Typography variant="h2" paragraph>
            Add Destination
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={inUS}
                onChange={() => {
                  setInUS((inUS) => !inUS)
                }}
                color="primary"
              />
            }
            label="Is this destination in the US?"
          />
          <TextField
            fullWidth
            id={`location`}
            value={formik.values.location}
            label="Location"
            onChange={formik.handleChange}
            className={classes.textField}
            required
          />
          {inUS ? (
            <>
              <TextField
                fullWidth
                required
                id={`state`}
                value={formik.values.state}
                label="State"
                onChange={formik.handleChange}
                className={classes.textField}
              />
              <TextField
                fullWidth
                required
                id={`state_abbreviation`}
                value={formik.values.state_abbreviation}
                label="State Abbreviation"
                onChange={formik.handleChange}
                className={classes.textField}
                helperText="Two Letter Abbreviation (CA, NY, etc.)"
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                id={`country`}
                required
                value={formik.values.country}
                label="Country"
                onChange={formik.handleChange}
                className={classes.textField}
              />
              <TextField
                fullWidth
                id={`country_abbreviation`}
                required
                value={formik.values.country_abbreviation}
                label="Country Abbreviation"
                onChange={formik.handleChange}
                className={classes.textField}
                helperText="Three Letter Abbreviation (USA, ESP, etc.)"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.onClose()
              formik.resetForm()
              setInUS(true)
            }}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default AddDestinationModal
