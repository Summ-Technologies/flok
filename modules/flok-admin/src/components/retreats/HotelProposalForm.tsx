import {
  FormControl,
  InputLabel,
  makeStyles,
  Paper,
  Select,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {AdminLodgingProposalModel} from "../../models"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
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
    padding: theme.spacing(2),
    display: "flex",
    width: "100%",
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
  },
}))

type HotelProposalFormProps = {proposal: AdminLodgingProposalModel}
export default function HotelProposalForm(props: HotelProposalFormProps) {
  let classes = useStyles(props)
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
  }
  return (
    <form className={classes.root}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">General info</AppTypography>
        <TextField {...textFieldProps} label="Dates" />
        <TextField {...textFieldProps} label="# Guests" type="number" />
        <TextField {...textFieldProps} label="Guestroom rates" type="number" />
        <TextField
          {...textFieldProps}
          label="Approximate room total"
          type="number"
        />
        <FormControl>
          <InputLabel shrink id="on-hold-label">
            Rooms on hold?
          </InputLabel>
          <Select native labelId="on-hold-label">
            <option value={"true"}>On hold</option>
            <option value={"false"}>Not on hold</option>
          </Select>
        </FormControl>
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Guest rooms</AppTypography>
        <TextField {...textFieldProps} label="Rates" />
        <TextField {...textFieldProps} label="Room total" />
        <TextField {...textFieldProps} label="Resort fee" />
        <TextField {...textFieldProps} label="Tax rates" />
        <TextField {...textFieldProps} label="Additional fees" />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Meeting spaces</AppTypography>
        <TextField {...textFieldProps} label="Suggested meeting rooms" />
        <TextField {...textFieldProps} label="Meeting room rates" />
        <TextField {...textFieldProps} label="Meeting room tax rates" />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Food and beverage</AppTypography>
        <TextField {...textFieldProps} label="Food and beverage minimum" />
        <TextField {...textFieldProps} label="Food and beverage service fee" />
        <TextField {...textFieldProps} label="Average breakfast price" />
        <TextField {...textFieldProps} label="Average snack price" />
        <TextField {...textFieldProps} label="Average lunch price" />
        <TextField {...textFieldProps} label="Average dinner price" />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Additional info</AppTypography>
        <TextField {...textFieldProps} label="Additional notes" />
      </Paper>
    </form>
  )
}
