import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core"
import {DeleteOutlineRounded} from "@material-ui/icons"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  table: {
    "& .MuiTableCell-root": {
      fontSize: theme.typography.body1.fontSize,
    },
    "& .MuiTableCell-stickyHeader": {
      backgroundColor: "unset",
    },
  },
  tableHead: {
    "& .MuiTableRow-root:last-of-type > .MuiTableCell-root": {
      borderBottomWidth: 2,
      borderBottomColor: theme.palette.grey[400],
    },
  },
  tableBody: {
    "& .MuiTableRow-root:last-of-type > .MuiTableCell-root": {
      borderBottom: "none",
    },
  },
  employeeColCell: {
    width: "35ch",
  },
  ctaContainer: {
    display: "flex",
    marginTop: theme.spacing(4),
  },
  cta: {
    marginLeft: "auto",
  },
}))

type AppAttendeesListBodyProps = {
  attendees: {id: number; name: string; city: string}[]
}
export default function AppAttendeesListBody(props: AppAttendeesListBodyProps) {
  let classes = useStyles(props)
  return (
    <>
      <Paper className={classes.root}>
        <Table className={classes.table} stickyHeader>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell className={classes.employeeColCell}>
                Employee
              </TableCell>
              <TableCell>City</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {props.attendees.map((attendee) => (
              <TableRow>
                <TableCell className={classes.employeeColCell}>
                  {attendee.name}
                </TableCell>
                <TableCell>{attendee.city}</TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <DeleteOutlineRounded />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <div className={classes.ctaContainer}>
        <Button
          color="primary"
          variant="contained"
          className={classes.cta}
          size="large">
          Add new attendee
        </Button>
      </div>
    </>
  )
}
