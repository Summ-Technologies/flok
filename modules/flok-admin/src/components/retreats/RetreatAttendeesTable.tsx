import {Button, Chip, makeStyles} from "@material-ui/core"
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@material-ui/data-grid"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {
  AdminRetreatAttendeeModel,
  RetreatAttendeeInfoStatusType,
} from "../../models"
import {enqueueSnackbar} from "../../notistack-lib/actions"

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

export type RetreatAttendeesTableRow = Pick<
  AdminRetreatAttendeeModel,
  "id" | "name" | "email_address" | "info_status"
>

type RetreatAttendeesTableProps = {
  rows: RetreatAttendeesTableRow[]
  onSelect: (id: number) => void
}

export default function RetreatAttendeesTable(
  props: RetreatAttendeesTableProps
) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  function onView(params: GridCellParams, flight: boolean) {
    let rowIdAsString = params.getValue(params.id, "id")?.toString()
    let rowId = rowIdAsString ? parseInt(rowIdAsString) : null
    if (rowId != null && !isNaN(rowId)) {
      props.onSelect(rowId)
    } else {
      dispatch(enqueueSnackbar({message: "Something went wrong"}))
    }
  }

  const [sortModel, setSortModel] = useState<GridSortModel | undefined>([])
  const commonColDefs = {}
  const retreatsTableColumns: GridColDef[] = [
    {
      ...commonColDefs,
      field: "attendeeButton",
      headerName: " ",
      width: 150,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => onView(params, false)}>
          View Attendee
        </Button>
      ),
    },
    {
      ...commonColDefs,
      field: "id",
      headerName: "ID",
      width: 75,
    },
    {
      ...commonColDefs,
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      ...commonColDefs,
      field: "email_address",
      headerName: "Email Address",
      width: 200,
    },
    {
      ...commonColDefs,
      field: "infoStatus",
      headerName: "Reg. Status",
      width: 250,
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
        let val: RetreatAttendeeInfoStatusType = params.getValue(
          params.id,
          "info_status"
        ) as RetreatAttendeeInfoStatusType
        switch (val) {
          case "CREATED":
            return (
              <Chip
                size="small"
                label="Pending"
                style={{backgroundColor: "yellow"}}
              />
            )
          case "INFO_ENTERED":
            return (
              <Chip
                size="small"
                label="Registered"
                style={{color: "white", backgroundColor: "green"}}
              />
            )
          default:
            return <></>
        }
      },
    },
  ]
  return (
    <DataGrid
      className={classes.root}
      classes={{cell: classes.cell}}
      sortModel={sortModel}
      onSortModelChange={() => setSortModel(undefined)}
      rows={props.rows}
      columns={retreatsTableColumns}
      components={{
        Toolbar: GridToolbar,
      }}
      disableSelectionOnClick
      disableColumnMenu
      density="compact"
      pageSize={50}
      pagination
      rowsPerPageOptions={[]}
    />
  )
}
