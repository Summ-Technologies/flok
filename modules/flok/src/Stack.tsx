import React from "react"
import {Route, Switch} from "react-router-dom"
import PageContainer from "./components/page/PageContainer"
import PageSidenav from "./components/page/PageSidenav"
import AuthResetPage from "./pages/auth/AuthResetPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import SigninPage from "./pages/auth/SigninPage"
import AttendeePage from "./pages/dashboard/AttendeePage"
import AttendeesPage from "./pages/dashboard/AttendeesPage"
import FlightsPage from "./pages/dashboard/FlightsPage"
import LodgingContractPage from "./pages/dashboard/LodgingContractPage"
import LodgingPage from "./pages/dashboard/LodgingPage"
import LodgingProposalPage from "./pages/dashboard/LodgingProposalPage"
import LodgingProposalsPage from "./pages/dashboard/LodgingProposalsPage"
import RetreatHomePage from "./pages/dashboard/RetreatHomePage"
import DeprecatedNewRetreatFormPage from "./pages/deprecated/DeprecatedNewRetreatFormPage"
import DeprecatedProposalPage from "./pages/deprecated/DeprecatedProposalPage"
import DeprecatedProposalsListPage from "./pages/deprecated/DeprecatedProposalsListPage"
import DeprecatedRetreatPreferencesFormPage from "./pages/deprecated/DeprecatedRetreatPreferencesFormPage"
import HomeRoutingPage from "./pages/HomeRoutingPage"
import NotFound404Page from "./pages/misc/NotFound404Page"
import ProtectedRoute from "./pages/misc/ProtectedRoute"
import RetreatProvider from "./pages/misc/RetreatProvider"

export type FlokPageName = keyof typeof AppRoutes.pages

export class AppRoutes {
  static deprecatedPages = {
    RetreatFiltersPage: "",
    DestinationPage: "",
    DestinationsListPage: "",
    HotelsListPage: "",
    HotelPage: "",
  }
  static pages = {
    ...AppRoutes.deprecatedPages,
    HomeRoutingPage: "/",

    SigninPage: "/login",
    ForgotPasswordPage: "/forgot-password",
    PasswordResetPage: "/reset-password",

    RetreatHomePage: "/r/:retreatIdx",

    RetreatLodgingPage: "/r/:retreatIdx/lodging",
    RetreatLodgingProposalsPage: "/r/:retreatIdx/lodging/proposals",
    RetreatLodgingProposalPage: "/r/:retreatIdx/lodging/proposals/:hotelGuid", // no sidebar
    RetreatLodgingContractPage: "/r/:retreatIdx/lodging/contract", // no sidebar

    RetreatAttendeesPage: "/r/:retreatIdx/attendees",
    RetreatAttendeePage: "/r/:retreatIdx/attendees/:attendeeId",
    RetreatAttendeeFlightsPage: "/r/:retreatIdx/attendees/:attendeeId/flights",

    RetreatFlightsPage: "/r/:retreatIdx/flights",

    RetreatBudgetPage: "/r/:retreatIdx/budget",

    // TODO, remove once dashboard release
    DeprecatedNewRetreatFormPage: "/getting-started",
    DeprecatedRetreatPreferencesFormPage: "/r/:retreatGuid/preferences",
    DeprecatedProposalsListPage: "/r/:retreatGuid/proposals",
    DeprecatedProposalPage: "/r/:retreatGuid/proposals/:hotelGuid",
  }

  static getPath(
    name: FlokPageName,
    pathParams: {[key: string]: string} = {}
  ): string {
    let path = this.pages[name]
    Object.keys(pathParams).forEach((key) => {
      let value = pathParams[key]
      let toReplace = ":" + key
      path = path.replace(toReplace, value)
    })
    return path
  }
}

export default function Stack() {
  return (
    <Switch>
      {/* Non authenticated routes */}
      <Route
        path={AppRoutes.getPath("HomeRoutingPage")}
        exact
        component={HomeRoutingPage}
      />
      <Route
        path={AppRoutes.getPath("DeprecatedNewRetreatFormPage")}
        exact
        component={DeprecatedNewRetreatFormPage}
      />
      <Route
        path={AppRoutes.getPath("DeprecatedRetreatPreferencesFormPage")}
        exact
        component={DeprecatedRetreatPreferencesFormPage}
      />
      <Route
        path={AppRoutes.getPath("DeprecatedProposalsListPage")}
        exact
        component={DeprecatedProposalsListPage}
      />
      <Route
        path={AppRoutes.getPath("DeprecatedProposalPage")}
        exact
        component={DeprecatedProposalPage}
      />
      {/* Authentication routes */}
      <Route
        path={AppRoutes.getPath("SigninPage")}
        exact
        component={SigninPage}
      />
      <Route
        path={AppRoutes.getPath("PasswordResetPage")}
        exact
        component={AuthResetPage}
      />
      <Route
        path={AppRoutes.getPath("ForgotPasswordPage")}
        exact
        component={ForgotPasswordPage}
      />

      {/* Dashboard routes */}
      <ProtectedRoute path="/r/:retreatIdx">
        <RetreatProvider>
          <PageContainer>
            <PageSidenav />
            {/* Overview */}
            <Switch>
              <Route exact path={AppRoutes.getPath("RetreatHomePage")}>
                <RetreatHomePage />
              </Route>

              {/* Lodging */}
              <Route exact path={AppRoutes.getPath("RetreatLodgingPage")}>
                <LodgingPage />
              </Route>
              <Route
                exact
                path={AppRoutes.getPath("RetreatLodgingProposalsPage")}>
                <LodgingProposalsPage />
              </Route>
              <Route
                exact
                path={AppRoutes.getPath("RetreatLodgingProposalPage")}>
                <LodgingProposalPage />
              </Route>
              <Route
                exact
                path={AppRoutes.getPath("RetreatLodgingContractPage")}>
                <LodgingContractPage />
              </Route>

              {/* Attendees */}
              <Route exact path={AppRoutes.getPath("RetreatAttendeesPage")}>
                <AttendeesPage />
              </Route>
              <Route exact path={AppRoutes.getPath("RetreatAttendeePage")}>
                <AttendeePage />
              </Route>
              <Route
                exact
                path={AppRoutes.getPath("RetreatAttendeeFlightsPage")}>
                <AttendeePage />
              </Route>

              {/* Flights */}
              <Route exact path={AppRoutes.getPath("RetreatFlightsPage")}>
                <FlightsPage />
              </Route>
              <Route path={"*"} component={NotFound404Page} />
            </Switch>
          </PageContainer>
        </RetreatProvider>
      </ProtectedRoute>
      <Route path={"*"} component={NotFound404Page} />
    </Switch>
  )
}
