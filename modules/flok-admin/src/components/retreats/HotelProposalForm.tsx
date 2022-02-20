import {
  Box,
  Button,
  FormControl,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {Add, Remove} from "@material-ui/icons"
import clsx from "clsx"
import {useFormik} from "formik"
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
  additionalInfoGroup: {
    width: "100%",
  },
}))

type HotelProposalFormProps = {
  proposal: AdminLodgingProposalModel
  onSave: (values: AdminLodgingProposalModel) => void
  onDelete: () => void
}
export default function HotelProposalForm(props: HotelProposalFormProps) {
  let classes = useStyles(props)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.proposal,
    onSubmit: (values) => props.onSave(values),
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    style: {whiteSpace: "pre"},
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }
  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">General info</AppTypography>
        <TextField
          {...textFieldProps}
          id="dates"
          label="Dates"
          value={formik.values.dates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="num_guests"
          label="# Guests"
          type="number"
          value={formik.values.num_guests ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="compare_room_rate"
          label="Guestroom rates"
          type="number"
          value={formik.values.compare_room_rate ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="compare_room_total"
          label="Approximate room total"
          type="number"
          value={formik.values.compare_room_total ?? ""}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Guest rooms</AppTypography>
        <TextField
          {...textFieldProps}
          id="guestroom_rates"
          label="Rates"
          multiline
          value={formik.values.guestroom_rates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="approx_room_total"
          label="Room total"
          multiline
          value={formik.values.approx_room_total ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="resort_fee"
          label="Resort fee"
          multiline
          value={formik.values.resort_fee ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="tax_rates"
          label="Tax rates"
          multiline
          value={formik.values.tax_rates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="additional_fees"
          label="Additional fees"
          multiline
          value={formik.values.additional_fees ?? ""}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Meeting spaces</AppTypography>
        <TextField
          {...textFieldProps}
          id="suggested_meeting_spaces"
          label="Suggested meeting rooms"
          multiline
          value={formik.values.suggested_meeting_spaces ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="meeting_room_tax_rates"
          label="Meeting room rates"
          multiline
          value={formik.values.meeting_room_rates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="meeting_room_tax_rates"
          label="Meeting room tax rates"
          multiline
          value={formik.values.meeting_room_tax_rates ?? ""}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Food and beverage</AppTypography>
        <TextField
          {...textFieldProps}
          id="food_bev_minimum"
          label="Food and beverage minimum"
          multiline
          value={formik.values.food_bev_minimum ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="food_bev_service_fee"
          label="Food and beverage service fee"
          multiline
          value={formik.values.food_bev_service_fee ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_breakfast_price"
          label="Average breakfast price"
          multiline
          value={formik.values.avg_breakfast_price ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_snack_price"
          label="Average snack price"
          multiline
          value={formik.values.avg_snack_price ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_lunch_price"
          label="Average lunch price"
          multiline
          value={formik.values.avg_lunch_price ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_dinner_price"
          label="Average dinner price"
          multiline
          value={formik.values.avg_dinner_price ?? ""}
        />
      </Paper>
      <Paper
        elevation={0}
        className={clsx(classes.formGroup, classes.additionalInfoGroup)}>
        <AppTypography variant="h4">Additional info</AppTypography>
        <TextField
          {...textFieldProps}
          id="cost_saving_notes"
          variant="outlined"
          minRows={5}
          label="Additional notes"
          multiline
          value={formik.values.cost_saving_notes ?? ""}
        />
        <AdditionalLinksInput links={props.proposal.additional_links ?? []} />
      </Paper>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Button color="secondary" variant="outlined" onClick={props.onDelete}>
          Delete Proposal
        </Button>
        <Button type="submit" color="primary" variant="contained">
          Save Changes
        </Button>
      </Box>
    </form>
  )
}

function AdditionalLinksInput(props: {
  links: {link_url: string; link_text: string}[]
}) {
  return (
    <FormControl>
      <AppTypography variant="body2">Additional links</AppTypography>
      {props.links.map((link) => (
        <Box display="flex" alignItems="center" marginY={1}>
          <TextField
            InputLabelProps={{shrink: true}}
            style={{flex: 1}}
            value={link.link_text ?? ""}
            label="Link text"
          />
          <TextField
            InputLabelProps={{shrink: true}}
            style={{flex: 1, marginLeft: 4, marginRight: 4}}
            value={link.link_url ?? ""}
            label="Link URL"
          />
          <IconButton size="small">
            <Remove fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box marginLeft="auto" marginTop={1}>
        <IconButton>
          <Add />
        </IconButton>
      </Box>
    </FormControl>
  )
}
