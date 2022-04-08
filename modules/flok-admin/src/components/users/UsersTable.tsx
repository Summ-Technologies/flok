import {Button, makeStyles} from "@material-ui/core"
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@material-ui/data-grid"
import _ from "lodash"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {User} from "../../models"
import {enqueueSnackbar} from "../../notistack-lib/actions"
import {patchUser} from "../../store/actions/admin"
import {
  getDateFromString,
  getDateTimeString,
  useRetreatUsers,
} from "../../utils"
import AppLoadingScreen from "../base/AppLoadingScreen"
import NewUserModal from "../users/NewUserModal"
import SearchUserModal from "./SearchUserModal"
import UserInfoModal from "./UserInfoModal"

let useStyles = makeStyles((theme) => ({
  newUserRow: {
    marginLeft: "auto",
    marginBottom: theme.spacing(1),
  },
  table: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
  },
}))

type UsersTableProps = {retreatId?: number}

export default function UsersTable(props: UsersTableProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let [users, loading] = useRetreatUsers(props.retreatId)

  let [activeUser, setActiveUser] = useState<User | undefined>(undefined)
  let [newUserOpen, setNewUserOpen] = useState(false)
  let [addUserOpen, setAddUserOpen] = useState(false)

  const createTableRows = (users: {[id: number]: User}) =>
    _.values(users).map((u) => ({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      createdAt: u.created_at,
      retreatIds: u.retreat_ids,
    }))
  const onViewUser = (params: GridCellParams) => {
    let rowIdAsString = params.getValue(params.id, "id")?.toString()
    let rowId = rowIdAsString ? parseInt(rowIdAsString) : null
    if (rowId != null && !isNaN(rowId)) {
      setActiveUser((users ?? {})[rowId])
      console.log(activeUser, users)
    } else {
      dispatch(enqueueSnackbar({message: "Something went wrong"}))
    }
  }

  const handleAddUser = (user: User) => {
    dispatch(
      patchUser(
        user.id,
        user.first_name,
        user.last_name,
        _.uniq(
          user.retreat_ids.concat(props.retreatId ? [props.retreatId] : [])
        )
      )
    )
    setAddUserOpen(false)
  }

  const [sortModel, setSortModel] = useState<GridSortModel | undefined>([
    {
      field: "createdAt",
      sort: "desc",
    },
  ])
  const tableCols: GridColDef[] = [
    {
      field: "button",
      headerName: " ",
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => onViewUser(params)}>
          View
        </Button>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 75,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      type: "dateTime",
      width: 150,
      valueFormatter: (params) =>
        getDateTimeString(getDateFromString(params.value as string)),
    },
    {
      field: "retreatIds",
      headerName: "Retreat IDs",
      width: 200,
      renderCell: (params) => (params.value as number[]).join(", "),
    },
  ]
  return (
    <>
      {loading || users === undefined ? (
        <AppLoadingScreen />
      ) : (
        <>
          <div className={classes.newUserRow}>
            {props.retreatId && (
              <Button
                onClick={() => setAddUserOpen(true)}
                variant="contained"
                style={{marginRight: 6}}
                color="primary">
                Add existing user
              </Button>
            )}
            <Button
              onClick={() => setNewUserOpen(true)}
              variant="outlined"
              color="primary">
              Create new user
            </Button>
          </div>
          <DataGrid
            className={classes.table}
            sortModel={sortModel}
            onSortModelChange={() => setSortModel(undefined)}
            rows={createTableRows(users)}
            columns={tableCols}
            components={{Toolbar: GridToolbar}}
            disableSelectionOnClick
            disableColumnMenu
            density="compact"
            pageSize={50}
            pagination
            rowsPerPageOptions={[]}
          />
        </>
      )}
      <NewUserModal
        open={newUserOpen}
        autofill={props.retreatId}
        onClose={(submitted) => setNewUserOpen(false)}
      />
      {activeUser && (
        <UserInfoModal
          user={activeUser}
          open={activeUser !== undefined}
          onClose={() => setActiveUser(undefined)}
        />
      )}
      <SearchUserModal
        onSubmit={(user) => handleAddUser(user)}
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
      />
    </>
  )
}
