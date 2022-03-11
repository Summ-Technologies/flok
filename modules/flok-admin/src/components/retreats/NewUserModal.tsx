import {Box, Dialog, Paper, TextField, TextFieldProps} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import {useFormik} from "formik"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AdminRetreatListModel} from "../../models"
import {RootState} from "../../store"
import {getRetreatsList, postUser} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"

type NewUserModalProps = {open: boolean}
export default function NewUserModal(props: NewUserModalProps) {
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
    },
  })

  let [newOption, setNewOption] = useState("")

  let retreatList = useSelector((state: RootState) => {
    console.log(state.admin.retreatsList)
    return state.admin.retreatsList.active
  })
  useEffect(() => {
    if (retreatList.length === 0) {
      console.log("HI")
      dispatch(getRetreatsList("active"))
    }
  }, [dispatch, retreatList.length])

  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
  }
  return (
    <Dialog open={props.open}>
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
            <form>
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
                id="retreatId"
                value={formik.values.retreats}
                multiple
                getOptionLabel={(r) =>
                  r.id.toString().concat(" - ").concat(r.company_name)
                }
                filterSelectedOptions
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                onInputChange={(e, value, reason) => {
                  if (reason !== "reset" || e != null) setNewOption(value)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...commonTextFieldProps}
                    inputProps={{
                      ...params.inputProps,
                      onKeyPress: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          return false
                        }
                      },
                    }}
                    onChange={undefined}
                    label="Retreat"
                    placeholder="Select a retreat"
                  />
                )}
                options={retreatList}
                onChange={(e, newVals) =>
                  formik.setFieldValue("retreats", newVals)
                }
              />
            </form>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  )
}
