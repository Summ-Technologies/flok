import {
  Button,
  Dialog,
  Link,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import {useFormik} from "formik"
import _ from "lodash"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import config, {FLOK_BASE_URL_KEY} from "../../config"
import {AdminRetreatListModel, User} from "../../models"
import {RootState} from "../../store"
import {getUserLoginToken, patchUser} from "../../store/actions/admin"
import {theme} from "../../theme"
import {
  getDateFromString,
  nullifyEmptyString,
  useRetreatList,
} from "../../utils"
import AppLoadingScreen from "../base/AppLoadingScreen"
import AppTypography from "../base/AppTypography"
let useStyles = makeStyles((theme) => ({
  buttonGroup: {},
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-2),
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  },
  formGroup: {
    position: "relative",
    padding: theme.spacing(2),
    display: "flex",
    width: "100%",
    flexDirection: "column",
    "& > *:nth-child(n+3)": {marginTop: theme.spacing(2)},
  },
}))
type UserInfoModalProps = {user: User; onClose: () => void; open: boolean}
export default function UserInfoModal(props: UserInfoModalProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let [loadingUpdate, setLoadingUpdate] = useState(false)

  let retreatList = useRetreatList()
  let [initialRetreatsLoaded, setInitialRetreatsLoaded] = useState(false)

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: props.user.email,
      firstName: props.user.first_name,
      lastName: props.user.last_name,
      retreats: props.user.retreat_ids
        .map((id) => retreatList.find((r) => r.id === id))
        .filter((r) => r !== undefined) as AdminRetreatListModel[],
      dateCreated: getDateFromString(props.user.created_at),
    },
    onSubmit: (values) => {
      setLoadingUpdate(true)
      dispatch(
        patchUser(
          props.user.id,
          formik.values.firstName,
          formik.values.lastName,
          formik.values.retreats.map((r) => r.id)
        )
      )
      setLoadingUpdate(false)
      props.onClose()
    },
  })

  useEffect(() => {
    if (
      retreatList.length >= 0 &&
      _.isEqual(
        nullifyEmptyString(formik.initialValues),
        nullifyEmptyString(formik.values) && !initialRetreatsLoaded
      )
    ) {
      formik.setFieldValue(
        "retreats",
        props.user.retreat_ids
          .map((id) => retreatList.find((r) => r.id === id))
          .filter((r) => r !== undefined) as AdminRetreatListModel[]
      )
      setInitialRetreatsLoaded(true)
    }
  }, [dispatch, retreatList, formik, props.user, initialRetreatsLoaded])

  let loginToken = useSelector(
    (state: RootState) => state.admin.userLoginTokens[props.user.id]
  )
  let resetPwUrl = loginToken
    ? `${config.get(FLOK_BASE_URL_KEY)}/reset-password?loginToken=${loginToken}`
    : undefined

  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
  }
  return (
    <Dialog
      open={props.open}
      maxWidth="md"
      fullWidth={true}
      onClose={props.onClose}>
      <Paper>
        <form className={classes.root} onSubmit={formik.handleSubmit}>
          <Paper elevation={0} className={classes.formGroup}>
            <div>{loadingUpdate ? <AppLoadingScreen /> : undefined}</div>
            <AppTypography variant="h4">User Profile</AppTypography>
            <TextField
              id="email"
              disabled
              {...commonTextFieldProps}
              value={formik.values.email}
              label="Email Address"
            />
            <TextField
              id="dateCreated"
              value={formik.values.dateCreated}
              {...commonTextFieldProps}
              disabled
              type="datetime"
              label="Date Created"
            />
            <TextField
              id="firstName"
              {...commonTextFieldProps}
              value={formik.values.firstName}
              label="First Name"
            />
            <TextField
              id="lastName"
              {...commonTextFieldProps}
              value={formik.values.lastName}
              label="Last Name"
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
                  label="Retreat(s)"
                  placeholder="Select a retreat"
                />
              )}
              options={retreatList}
              onChange={(e, newVals) =>
                formik.setFieldValue("retreats", newVals)
              }
            />
            <TextField
              {...commonTextFieldProps}
              id="loginToken"
              value={loginToken || ""}
              disabled
              label="Active login token"
              helperText={
                resetPwUrl ? (
                  <Link variant="inherit" href={resetPwUrl} target="_blank">
                    {resetPwUrl}
                  </Link>
                ) : undefined
              }
            />
            <div className={classes.buttonGroup}>
              <Button
                disabled={_.isEqual(
                  nullifyEmptyString(formik.initialValues),
                  nullifyEmptyString(formik.values)
                )}
                type="submit"
                variant="contained"
                style={{marginRight: theme.spacing(1)}}
                color="primary">
                Submit changes
              </Button>
              <Button
                variant="outlined"
                style={{marginRight: theme.spacing(1)}}
                onClick={props.onClose}
                color="primary">
                Close
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  dispatch(getUserLoginToken(props.user.id))
                }}>
                Generate login token
              </Button>
            </div>
          </Paper>
        </form>
      </Paper>
    </Dialog>
  )
}
