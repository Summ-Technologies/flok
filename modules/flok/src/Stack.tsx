import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, Switch} from "react-router-dom"
import AttendeesPage from "./pages/AttendeesPage"
import AuthResetPage from "./pages/auth/AuthResetPage"
import SigninPage from "./pages/auth/SigninPage"
import FlightsPage from "./pages/FlightsPage"
import ItineraryPage from "./pages/ItineraryPage"
import LodgingPage from "./pages/LodgingPage"
import NotFound404Page from "./pages/misc/NotFound404Page"
import RedirectPage from "./pages/misc/RedirectPage"
import OverviewPage from "./pages/OverviewPage"
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
      name: "OverviewPage",
      component: <OverviewPage />,
      path: "/",
      // loginStatus: ["LOGGED_IN"],
    },
    {
      name: "LodgingPage",
      component: <LodgingPage />,
      path: "/lodging",
      // loginStatus: ["LOGGED_IN"],
    },
    {
      name: "AttendeesPage",
      component: <AttendeesPage />,
      path: "/attendees",
      // loginStatus: ["LOGGED_IN"],
    },
    {
      name: "FlightsPage",
      component: <FlightsPage />,
      path: "/flights",
      // loginStatus: ["LOGGED_IN"],
    },
    {
      name: "ItineraryPage",
      component: <ItineraryPage />,
      path: "/itinerary",
      // loginStatus: ["LOGGED_IN"],
    },
    {
      name: "SigninPage",
      component: <SigninPage />,
      path: "/auth/signin",
      loginStatus: "LOGGED_OUT",
    },
    {
      name: "AuthResetPage",
      component: <AuthResetPage />,
      path: "/auth/reset",
    },
    {
      name: "RedirectSignin",
      component: <RedirectPage pageName="SigninPage" />,
      path: "*",
      loginStatus: "LOGGED_OUT",
    },
    {
      name: "RedirectLoggedOutPaths",
      component: <RedirectPage pageName="OverviewPage" />,
      path: ["/auth/signin"],
      loginStatus: "LOGGED_IN",
    },
    {
      name: "NotFoundPage",
      component: <NotFound404Page />,
      path: "*",
      loginStatus: ["LOGGED_IN", "LOGGED_OUT"],
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

  console.log(routes)
  return <Switch>{routes}</Switch>
}
