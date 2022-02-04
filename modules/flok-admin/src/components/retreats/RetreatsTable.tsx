import {Button, makeStyles} from "@material-ui/core"
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
} from "@material-ui/data-grid"
import React from "react"
import {useDispatch} from "react-redux"
import {RetreatStateOptions} from "../../models"
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

export type RetreatsTableRow = {
  id: number
  guid: string
  companyName: string
  contactEmail: string
  numAttendees: number
  flokOwner: string
  flokState: string
  createdAt: string
  edited?: boolean
}

type RetreatsTableProps = {
  rows: RetreatsTableRow[]
  onSelect: (id: number) => void
}
export default function RetreatsTable(props: RetreatsTableProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  function onViewRetreat(params: GridCellParams) {
    let rowIdAsString = params.getValue(params.id, "id")?.toString()
    let rowId = rowIdAsString ? parseInt(rowIdAsString) : null
    if (rowId != null && !isNaN(rowId)) {
      props.onSelect(rowId)
    } else {
      dispatch(enqueueSnackbar({message: "Something went wrong"}))
    }
  }
  const commonColDefs = {}
  const retreatsTableColumns: GridColDef[] = [
    {
      ...commonColDefs,
      field: "button",
      headerName: " ",
      width: 150,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => onViewRetreat(params)}>
          View
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
      field: "guid",
      headerName: "GUID",
      width: 200,
    },
    {
      ...commonColDefs,
      field: "companyName",
      headerName: "Company",
      width: 200,
    },
    {
      ...commonColDefs,
      field: "numAttendees",
      headerName: "# Attendees",
      width: 100,
      hideSortIcons: false,
    },
    {
      ...commonColDefs,
      field: "flokOwner",
      headerName: "Flok Owner",
      width: 150,
    },
    {
      ...commonColDefs,
      field: "flokState",
      headerName: "Flok State",
      width: 150,
      type: "singleSelect",
      valueOptions: RetreatStateOptions,
    },
    {
      ...commonColDefs,
      field: "createdAt",
      headerName: "Created At",
      width: 250,
    },
  ]
  return (
    <DataGrid
      className={classes.root}
      classes={{cell: classes.cell}}
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
