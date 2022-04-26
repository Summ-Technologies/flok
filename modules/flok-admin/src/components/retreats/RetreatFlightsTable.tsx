import {Button, Chip, makeStyles} from "@material-ui/core"
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@material-ui/data-grid"
import {useState} from "react"
import {useHistory} from "react-router-dom"
import {
  AdminRetreatAttendeeModel,
  RetreatAttendeeFlightStatusType,
} from "../../models"

let useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.common.white,
  },
  cell: {
    "&:hover": {
      textOverflow: "clip",
      overflow: "visible",
      whiteSpace: "nowrap",
      maxWidth: "unset !important",
      wordBreak: "break-all",
    },
  },
}))
function RetreatFlightsTable(props: {
  retreatAttendees: AdminRetreatAttendeeModel[]
  retreatId: number
}) {
  let {retreatAttendees, retreatId} = props
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>([])
  let classes = useStyles(props)
  let history = useHistory()
  const columns: GridColDef[] = [
    {
      field: "",
      headerName: "",
      width: 200,
      renderCell: (params: any) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            history.push(
              `/retreats/${retreatId.toString()}/attendees/${params
                .getValue(params.id, "id")
                ?.toString()}?tab=flights`
            )
          }}>
          View Attendee
        </Button>
      ),
      sortable: false,
    },
    {field: "id", headerName: "ID", width: 100},
    {
      field: "last_name",
      headerName: "Last Name",
      width: 200,
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 200,
    },
    {
      field: "email_address",
      headerName: "Email Address",
      width: 200,
    },
    {
      field: "flight_status",
      headerName: "Flight Status",
      width: 200,
      type: "string",
      sortComparator: (v1, v2) => {
        if (v1 && v2) {
          return (v1 as string).localeCompare(v2 as string)
        } else if (v1) {
          return 1
        } else {
          return -1
        }
      },
      renderCell: (params) => {
        let val: RetreatAttendeeFlightStatusType = params.getValue(
          params.id,
          "flight_status"
        ) as RetreatAttendeeFlightStatusType
        switch (val) {
          case "PENDING":
            return (
              <Chip
                size="small"
                label="Pending"
                style={{backgroundColor: "yellow"}}
              />
            )
          case "BOOKED":
            return (
              <Chip
                size="small"
                label="Booked"
                style={{color: "white", backgroundColor: "green"}}
              />
            )
          case "OPT_OUT":
            return (
              <Chip
                size="small"
                label="Opt Out"
                style={{color: "white", backgroundColor: "grey"}}
              />
            )
          default:
            return <></>
        }
      },
    },
  ]

  const rows = retreatAttendees.map((attendee) => {
    return {
      id: attendee.id,
      last_name: attendee.last_name,
      first_name: attendee.first_name,
      email_address: attendee.email_address,
      flight_status: attendee.flight_status,
    }
  })
  return (
    <DataGrid
      className={classes.root}
      classes={{cell: classes.cell}}
      rows={rows}
      columns={columns}
      components={{
        Toolbar: GridToolbar,
      }}
      sortModel={sortModel}
      onSortModelChange={() => setSortModel(undefined)}
      disableSelectionOnClick
      disableColumnMenu
      density="compact"
      pageSize={50}
      pagination
      rowsPerPageOptions={[]}
    />
  )
}
export default RetreatFlightsTable
