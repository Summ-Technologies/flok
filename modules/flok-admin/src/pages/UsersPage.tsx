import {Breadcrumbs, Button, Link, makeStyles} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@material-ui/data-grid"
import _ from "lodash"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppLoadingScreen from "../components/base/AppLoadingScreen"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import NewUserModal from "../components/users/NewUserModal"
import UserInfoModal from "../components/users/UserInfoModal"
import {User} from "../models"
import {enqueueSnackbar} from "../notistack-lib/actions"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatDetails} from "../store/actions/admin"
import {theme} from "../theme"
import {getDateFromString, getDateTimeString, useRetreatUsers} from "../utils"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  table: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

type UsersPageProps = RouteComponentProps<{retreatId?: string}>

function UsersPage(props: UsersPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let retreatId = props.match.params.retreatId
    ? parseInt(props.match.params.retreatId)
    : -1

  let [users, loading] = useRetreatUsers(retreatId)

  let retreat = useSelector((state: RootState) =>
    retreatId === -1
      ? {company_name: ""}
      : state.admin.retreatsDetails[retreatId]
  )
  useEffect(() => {
    if (retreatId !== -1 && retreat === undefined) {
      dispatch(getRetreatDetails(retreatId))
    }
  })

  let [activeUser, setActiveUser] = useState<User | undefined>(undefined)

  let [newUserOpen, setNewUserOpen] = useState(false)

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
      setActiveUser(users[rowId])
      // if (retreatId !== -1) {
      //   dispatch(
      //     push(
      //       AppRoutes.getPath("RetreatUserPage", {
      //         userId: rowId.toString(),
      //         retreatId: retreatId.toString(),
      //       })
      //     )
      //   )
      // } else {
      //   dispatch(
      //     push(AppRoutes.getPath("UserPage", {userId: rowId.toString()}))
      //   )
      // }
    } else {
      dispatch(enqueueSnackbar({message: "Something went wrong"}))
    }
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
    <PageBase>
      <div className={classes.body}>
        {retreatId !== -1 && (
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              to={AppRoutes.getPath("RetreatsPage")}
              component={ReactRouterLink}>
              All Retreats
            </Link>
            <Link
              color="inherit"
              to={AppRoutes.getPath("RetreatPage", {
                retreatId: retreatId.toString(),
              })}
              component={ReactRouterLink}>
              {retreat?.company_name}
            </Link>
            <AppTypography color="textPrimary">Users</AppTypography>
          </Breadcrumbs>
        )}
        <Typography variant="h1">Users Page</Typography>
        {loading || users === undefined ? (
          <AppLoadingScreen />
        ) : (
          <>
            <div style={{marginLeft: "auto"}}>
              <Button
                style={{marginBottom: theme.spacing(0.5)}}
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
      </div>
      <NewUserModal
        open={newUserOpen}
        onClose={(submitted) => setNewUserOpen(false)}
      />
      {activeUser && (
        <UserInfoModal
          user={activeUser}
          open={activeUser !== undefined}
          onClose={() => setActiveUser(undefined)}
        />
      )}
    </PageBase>
  )
}

export default withRouter(UsersPage)
