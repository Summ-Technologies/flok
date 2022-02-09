import {makeStyles} from "@material-ui/core"
import {DataGrid, GridColDef} from "@material-ui/data-grid"
import React, {useState} from "react"
import {AdminRetreatDetailsModel} from "../../models"

let useStyles = makeStyles((theme) => ({
  root: {height: "100%"},
  selectedHotelsTable: {},
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

export type SelectedHotelRow = {
  hotel: string
  destination: string
  state: string
  numProposals: number
}

type RetreatLodgingDetailsProps = {retreat: AdminRetreatDetailsModel}
export default function RetreatLodgingDetails(
  props: RetreatLodgingDetailsProps
) {
  let classes = useStyles(props)
  let selectedHotelColumns: GridColDef[] = [
    {field: "hotel", headerName: "Hotel Name", width: 200, sortable: true},
    {
      field: "destination",
      headerName: "Destination",
      width: 200,
      sortable: true,
    },
    {field: "state", headerName: "Proposals state", width: 200, sortable: true},
    {
      field: "numProposals",
      headerName: "# proposals",
      width: 150,
      sortable: false,
    },
  ]
  let [rows, setRows] = useState<SelectedHotelRow[]>([])
  return (
    <div className={classes.root}>
      <DataGrid
        className={classes.root}
        classes={{cell: classes.cell}}
        rows={rows}
        columns={selectedHotelColumns}
        disableSelectionOnClick
        disableColumnMenu
        density="compact"
        pageSize={20}
        pagination
        rowsPerPageOptions={[]}
      />
    </div>
  )
}
