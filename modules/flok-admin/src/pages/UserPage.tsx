// import {Breadcrumbs} from "@material-ui/core"
// import {useEffect} from "react"
// import {useDispatch, useSelector} from "react-redux"
// import {
//   Link,
//   Link as ReactRouterLink,
//   RouteComponentProps,
//   withRouter,
// } from "react-router-dom"
// import AppLoadingScreen from "../components/base/AppLoadingScreen"
// import AppTypography from "../components/base/AppTypography"
// import PageBase from "../components/page/PageBase"
// import UserInfoForm from "../components/users/UserInfoModal"
// import {AppRoutes} from "../Stack"
// import {RootState} from "../store"
// import {getRetreatDetails} from "../store/actions/admin"
// import {useRetreatUsers} from "../utils"

// type UserPageProps = RouteComponentProps<{retreatId?: string; userId: string}>

// function UserPage(props: UserPageProps) {
//   let dispatch = useDispatch()
//   let retreatId = props.match.params.retreatId
//     ? parseInt(props.match.params.retreatId)
//     : -1

//   let retreat = useSelector((state: RootState) =>
//     retreatId === -1
//       ? {company_name: ""}
//       : state.admin.retreatsDetails[retreatId]
//   )
//   useEffect(() => {
//     if (retreat === undefined && retreatId !== -1) {
//       dispatch(getRetreatDetails(retreatId))
//     }
//   })

//   let userId = parseInt(props.match.params.userId)
//   let [users, _] = useRetreatUsers(retreatId)
//   return (
//     <PageBase>
//       {retreatId !== -1 ? (
//         <Breadcrumbs aria-label="breadcrumb">
//           <Link
//             color="inherit"
//             to={AppRoutes.getPath("RetreatsPage")}
//             component={ReactRouterLink}>
//             All Retreats
//           </Link>
//           <Link
//             color="inherit"
//             to={AppRoutes.getPath("RetreatPage", {
//               retreatId: retreatId.toString(),
//             })}
//             component={ReactRouterLink}>
//             {retreat?.company_name}
//           </Link>
//           <Link
//             color="inherit"
//             to={AppRoutes.getPath("RetreatUsersPage", {
//               retreatId: retreatId.toString(),
//             })}
//             component={ReactRouterLink}>
//             Users
//           </Link>
//           <AppTypography>
//             {users && users[userId]
//               ? users[userId].last_name + " " + users[userId].first_name
//               : ""}
//           </AppTypography>
//         </Breadcrumbs>
//       ) : (
//         <Breadcrumbs aria-label="breadcrumb">
//           <Link
//             color="inherit"
//             to={AppRoutes.getPath("AllUsersPage")}
//             component={ReactRouterLink}>
//             All Users
//           </Link>
//           <AppTypography>
//             {users && users[userId]
//               ? users[userId].last_name + " " + users[userId].first_name
//               : ""}
//           </AppTypography>
//         </Breadcrumbs>
//       )}

//       <AppTypography variant="h1">User Info</AppTypography>
//       {users && users[userId] && <UserInfoForm user={users[userId]} />}
//       {!(users && users[userId]) && <AppLoadingScreen />}
//     </PageBase>
//   )
// }

// export default withRouter(UserPage)

export {}
