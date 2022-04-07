import {Button, makeStyles} from "@material-ui/core"
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@material-ui/data-grid"
import React, {useState} from "react"
import {useDispatch} from "react-redux"
import {enqueueSnackbar} from "../../notistack-lib/actions"
import {TasksTableRow} from "../retreats/RetreatsTable"

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
  createdAt: Date
}

type TasksTableProps = {
  rows: TasksTableRow[]
  onSelect: (id: number) => void
}
export default function TasksTable(props: TasksTableProps) {
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
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>([
    {
      field: "id",
      sort: "asc",
    },
  ])
  const commonColDefs = {}
  const tasksTableColumns: GridColDef[] = [
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
      field: "title",
      headerName: "Title",
      width: 200,
    },
    {
      ...commonColDefs,
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      ...commonColDefs,
      field: "link",
      headerName: "Link",
      width: 200,
    },
  ]
  return (
    <DataGrid
      className={classes.root}
      classes={{cell: classes.cell}}
      sortModel={sortModel}
      onSortModelChange={() => setSortModel(undefined)}
      rows={props.rows}
      columns={tasksTableColumns}
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
