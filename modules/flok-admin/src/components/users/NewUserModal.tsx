import {
  Box,
  Button,
  Dialog,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import {AdminRetreatListModel} from "../../models"
import {postUser} from "../../store/actions/admin"
import {theme} from "../../theme"
import {nullifyEmptyString, useRetreatList} from "../../utils"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(1.25),
  },
}))

type NewUserModalProps = {open: boolean; onClose: (submitted: boolean) => void}
export default function NewUserModal(props: NewUserModalProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: null,
      firstName: null,
      lastName: null,
      retreats: [] as AdminRetreatListModel[],
    },
    onSubmit: (values) => {
      dispatch(
        postUser(
          values.email ?? "",
          values.firstName ?? "",
          values.lastName ?? "",
          values.retreats.map((r) => r.id)
        )
      )
      props.onClose(true)
    },
  })

  let retreatList = useRetreatList()

  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
    fullWidth: true,
    className: classes.textField,
  }
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Box
        position="fixed"
        top="50%"
        left="50%"
        style={{
          transform: "translate(-50%, -50%)",
        }}>
        <Paper>
          <Box paddingY={4} paddingX={2} display="flex" flexDirection="column">
            <AppTypography variant="body1" fontWeight="bold" paragraph>
              New User
            </AppTypography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                id="email"
                value={formik.values.email}
                type="email"
                required
                label="Email Address"
                {...commonTextFieldProps}
              />
              <TextField
                id="firstName"
                value={formik.values.firstName}
                label="First Name"
                required
                {...commonTextFieldProps}
              />
              <TextField
                id="lastName"
                value={formik.values.lastName}
                label="Last Name"
                required
                {...commonTextFieldProps}
              />
              <Autocomplete
                id="retreatIds"
                value={formik.values.retreats}
                multiple
                getOptionLabel={(r) =>
                  r.id.toString().concat(" - ").concat(r.company_name)
                }
                filterSelectedOptions
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...commonTextFieldProps}
                    required
                    inputProps={{
                      ...params.inputProps,
                      onKeyPress: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          return false
                        }
                      },
                      required: formik.values.retreats.length === 0,
                    }}
                    onChange={undefined}
                    label="Retreat(s)"
                    placeholder="Select a retreat"
                  />
                )}
                options={retreatList}
                onChange={(e, newVals) =>
                  formik.setFieldValue("retreats", newVals)
                }
              />
              <Button
                disabled={_.isEqual(
                  nullifyEmptyString(formik.initialValues),
                  nullifyEmptyString(formik.values)
                )}
                type="submit"
                variant="contained"
                style={{marginRight: theme.spacing(1)}}
                color="primary">
                Submit
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => props.onClose(false)}>
                Close
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  )
}
