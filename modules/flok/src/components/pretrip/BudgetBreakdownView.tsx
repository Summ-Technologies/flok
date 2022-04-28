import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import {ExpandLess, ExpandMore} from "@material-ui/icons"
import {Fragment, useState} from "react"
import {
  BudgetBreakdownInputType,
  BudgetBreakdownType,
} from "../../utils/pretripUtils"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  tableRow: {
    "& > *": {borderBottom: "unset"},
  },
  breakdownHeaderRow: {
    display: "flex",
    justifyContent: "flex-start",
  },
  expandableRowName: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  subBreakdown: {
    marginLeft: theme.spacing(20),
    marginRight: theme.spacing(20),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: 5,
    backgroundColor: theme.palette.background.default,
  },
}))

function BudgetRow(props: {
  name: string
  cost: number
  subRows: {name: string; cost: number; postCost: string}[]
}) {
  let classes = useStyles(props)
  let [open, setOpen] = useState(false)

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
        <TableCell>
          <AppTypography fontWeight="bold">{props.name}</AppTypography>
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
          <AppTypography>${props.cost}</AppTypography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{padding: 0}} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className={classes.subBreakdown}>
              {props.subRows.map((obj) => (
                <div style={{display: "flex"}}>
                  <AppTypography fontWeight="bold">{obj.name}:</AppTypography>
                  <AppTypography>
                    &nbsp;{`$${obj.cost} ${obj.postCost}`}
                  </AppTypography>
                </div>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default function BudgetBreakdownView(props: {
  breakdown: BudgetBreakdownType
  breakdownInput: BudgetBreakdownInputType
}) {
  let classes = useStyles(props)
  return (
    <div>
      <div className={classes.breakdownHeaderRow}>
        <AppTypography fontWeight="bold" variant="h2">
          Per Attendee Cost:
        </AppTypography>{" "}
        <AppTypography variant="h2" color="primary">
          ${props.breakdown.attendeeCost}
        </AppTypography>
      </div>
      <div className={classes.breakdownHeaderRow}>
        <AppTypography fontWeight="bold" variant="h2">
          Total Cost:{" "}
        </AppTypography>
        <AppTypography variant="h2" color="primary">
          ${props.breakdown.totalCost}
        </AppTypography>
      </div>
      <AppTypography variant="h2">Per Attendee Breakdown</AppTypography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Category</TableCell>
              <TableCell></TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <AppTypography fontWeight="bold">Accomodation</AppTypography>
              </TableCell>
              <TableCell>
                {`$${props.breakdown.hotelPerNight} per night x ${
                  props.breakdownInput.trip_length - 1
                } nights`}
              </TableCell>
              <TableCell>
                {`$${
                  props.breakdown.hotelPerNight *
                  (props.breakdownInput.trip_length - 1)
                }`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <AppTypography fontWeight="bold">Flights</AppTypography>
              </TableCell>
              <TableCell>{`$${props.breakdown.flight} per flight`}</TableCell>
              <TableCell>{`$${props.breakdown.flight * 2}`}</TableCell>
            </TableRow>
            {props.breakdown.activities && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <AppTypography fontWeight="bold">Activities</AppTypography>
                </TableCell>
                <TableCell>
                  ${props.breakdown.activities.cost} x{" "}
                  {props.breakdown.activities.num}
                </TableCell>
                <TableCell>
                  $
                  {props.breakdown.activities.cost *
                    props.breakdown.activities.num}
                </TableCell>
              </TableRow>
            )}
            <BudgetRow
              name="Ground Transport"
              cost={props.breakdown.ground_transport
                .map((o) => o.cost)
                .reduce((p, c) => p + c)}
              subRows={props.breakdown.ground_transport.map((obj) => ({
                name: obj.name,
                cost: obj.cost,
                postCost: "per person",
              }))}
            />
            <BudgetRow
              name="Meals"
              cost={props.breakdown.meals
                .map((obj) => obj.cost * obj.num)
                .reduce((p, v) => p + v)}
              subRows={props.breakdown.meals.map((obj) => ({
                name: obj.name,
                cost: obj.cost,
                postCost: `x ${obj.num} = $${obj.cost * obj.num} total`,
              }))}
            />
            <BudgetRow
              name="Miscellaneous"
              cost={props.breakdown.misc
                .map((obj) => obj.cost)
                .reduce((p, v) => p + v)}
              subRows={props.breakdown.misc.map((obj) => ({
                name: obj.name,
                cost: obj.cost,
                postCost: "per person",
              }))}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
