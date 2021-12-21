import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, Switch} from "react-router-dom"
import DestinationPage from "./pages/DestinationPage"
import DestinationsListPage from "./pages/DestinationsListPage"
import HomeRoutingPage from "./pages/HomeRoutingPage"
import HotelPage from "./pages/HotelPage"
import HotelsListPage from "./pages/HotelsListPage"
import NotFound404Page from "./pages/misc/NotFound404Page"
import NewRetreatFormPage from "./pages/NewRetreatFormPage"
import ProposalPage from "./pages/ProposalPage"
import ProposalRouter from "./pages/ProposalRouter"
import RetreatFiltersPage from "./pages/RetreatFiltersPage"
import RetreatPreferencesFormPage from "./pages/RetreatPreferencesFormPage"
import RetreatRoutingPage from "./pages/RetreatRoutingPage"
import RFPLiteResponsePage from "./pages/RFPLiteResponsePage"
import {getUserHome} from "./store/actions/user"
import UserGetters from "./store/getters/user"

type FlokRoute = {
  name: string
  component: JSX.Element
  path: string | string[]
  loginStatus?:
    | ("UNKNOWN" | "LOGGED_IN" | "LOGGED_OUT")[]
    | "UNKNOWN"
    | "LOGGED_IN"
    | "LOGGED_OUT"
}

export class AppRoutes {
  static routes: FlokRoute[] = [
    {
      name: "NewRetreatFormPage",
      component: <NewRetreatFormPage />,
      path: "/getting-started",
    },
    {
      name: "RetreatPreferencesFormPage",
      component: <RetreatPreferencesFormPage />,
      path: "/r/:retreatGuid/preferences",
    },
    {
      name: "RetreatFiltersPage",
      component: <RetreatFiltersPage />,
      path: "/r/:retreatGuid/filters",
    },
    {
      name: "DestinationsListPage",
      component: <DestinationsListPage />,
      path: "/r/:retreatGuid/destinations",
    },
    {
      name: "DestinationPage",
      component: <DestinationPage />,
      path: "/r/:retreatGuid/destinations/:destinationGuid",
    },
    {
      name: "HotelsListPage",
      component: <HotelsListPage />,
      path: "/r/:retreatGuid/hotels",
    },
    {
      name: "HotelPage",
      component: <HotelPage />,
      path: "/r/:retreatGuid/hotels/:hotelGuid",
    },
    {
      name: "ProposalsListPage",
      component: <ProposalRouter />,
      path: "/r/:retreatGuid/proposals",
    },
    {
      name: "ProposalPage",
      component: <ProposalPage />,
      path: "/r/:retreatGuid/proposals/:hotelGuid",
    },
    {
      name: "RFPLiteResponsePage",
      component: <RFPLiteResponsePage />,
      path: "/rfp-lite",
    },
    {
      name: "RetreatRoutingPage",
      component: <RetreatRoutingPage />,
      path: "/r/:retreatGuid",
    },
    {
      name: "HomeRoutingPage",
      component: <HomeRoutingPage />,
      path: "/",
    },
    {
      name: "NotFoundPage",
      component: <NotFound404Page />,
      path: "*",
    },
  ]
  static getRoutes(routes: FlokRoute[]): JSX.Element[] {
    return routes.map((route) => (
      <Route
        path={route.path}
        key={route.name}
        exact
        render={() => route.component}></Route>
    ))
  }

  static getPath(
    name: string,
    pathParams: {[key: string]: string} = {}
  ): string {
    let route: {path: string; name: string}[] = (
      this.routes as {path: string; name: string}[]
    ).filter((route) => route.name.toLowerCase() === name.toLowerCase())
    if (route.length !== 1) {
      throw Error("Can't get path for route named: " + name)
    }
    let _path = route[0].path
    let path: string
    if (Array.isArray(_path)) {
      path = _path[0]
    } else {
      path = _path
    }
    Object.keys(pathParams).forEach((key) => {
      let value = pathParams[key]
      let toReplace = ":" + key
      path = path.replace(toReplace, value)
    })
    return path
  }
}

export default function Stack() {
  let dispatch = useDispatch()

  let loginStatus = useSelector(UserGetters.getLoginStatus)
  let [routes, setRoutes] = useState<JSX.Element[]>([])

  useEffect(() => {
    setRoutes(
      AppRoutes.getRoutes(
        AppRoutes.routes.filter((val) =>
          val.loginStatus &&
          (val.loginStatus !== loginStatus ||
            !val.loginStatus.includes(loginStatus))
            ? false
            : true
        )
      )
    )
  }, [loginStatus, setRoutes])

  useEffect(() => {
    /** Helps determine user login status */
    dispatch(getUserHome())
  }, [dispatch, loginStatus])

  return <Switch>{routes}</Switch>
}
