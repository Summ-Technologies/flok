import React from "react"
import {Route, Switch} from "react-router-dom"
import AttendeeProfilePage from "./pages/AttendeeProfilePage"
import AuthResetPage from "./pages/auth/AuthResetPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import SigninPage from "./pages/auth/SigninPage"
import DeprecatedHomeRoutingPage from "./pages/deprecated/DeprecatedHomeRoutingPage"
import DeprecatedNewRetreatFormPage from "./pages/deprecated/DeprecatedNewRetreatFormPage"
import DeprecatedProposalPage from "./pages/deprecated/DeprecatedProposalPage"
import DeprecatedProposalsListPage from "./pages/deprecated/DeprecatedProposalsListPage"
import DeprecatedRetreatPreferencesFormPage from "./pages/deprecated/DeprecatedRetreatPreferencesFormPage"
import HomeRoutingPage from "./pages/HomeRoutingPage"
import LandingPageGenerator from "./pages/LandingPageGenerator"
import LodgingPage from "./pages/LodgingPage"
import NotFound404Page from "./pages/misc/NotFound404Page"
import ProtectedRoute from "./pages/misc/ProtectedRoute"
import RedirectPage from "./pages/misc/RedirectPage"
import RetreatProvider from "./pages/misc/RetreatProvider"
import ProposalPage from "./pages/ProposalPage"
import RetreatAttendeesPage from "./pages/RetreatAttendeesPage"
import RetreatFlightsPage from "./pages/RetreatFlightsPage"
import RetreatItineraryPage from "./pages/RetreatItineraryPage"
import RetreatOverviewPage from "./pages/RetreatOverviewPage"
import RetreatWebsite from "./pages/RetreatWebsite"

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
    RetreatWebsiteHome: "/retreats/:retreatName",
    RetreatWebsitePage: "/retreats/:retreatName/:pageName",
    // NewRetreatFormPage: "/getting-started",
    RetreatHomePage: "/r/:retreatIdx",
    RetreatFlightsPage: "/r/:retreatIdx/flights",
    // RetreatPreferencesFormPage: "/r/:retreatIdx/preferences",
    RetreatAttendeesPage: "/r/:retreatIdx/attendees",
    RetreatItineraryPage: "/r/:retreatIdx/itinerary",
    LodgingPage: "/r/:retreatIdx/lodging",
    ProposalPage: "/r/:retreatIdx/proposals/:hotelGuid",
    LandingPageGeneratorHome: "/r/:retreatIdx/landing",
    LandingPageGeneratorPage: "/r/:retreatIdx/landing/:currentPageId",
    LandingPageGeneratorConfig: "/r/:retreatIdx/landing/:currentPageId/config",
    LandingPageGeneratorConfigWebsiteSettings:
      "/r/:retreatIdx/landing/:currentPageId/config/website-settings",
    LandingPageGeneratorConfigPageSettings:
      "/r/:retreatIdx/landing/:currentPageId/config/page-settings/:pageId",
    LandingPageGeneratorConfigAddPage:
      "/r/:retreatIdx/landing/:currentPageId/config/add-page",
    AttendeeProfilePage: "/r/:retreatIdx/attendees/:attendeeId",
    AttendeeProfileFlightsPage: "/r/:retreatIdx/attendees/:attendeeId/flights",

    // TODO, remove once dashboard release
    DeprecatedHomeRoutingPage: "/",
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
  // TODO, remove once released dashboard
  const DASHBOARD_RELEASE = true
  if (!DASHBOARD_RELEASE) {
    return (
      <Switch>
        <Route
          path={AppRoutes.getPath("DeprecatedHomeRoutingPage")}
          exact
          component={DeprecatedHomeRoutingPage}
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
          path={"*"}
          render={() => <RedirectPage pageName="DeprecatedHomeRoutingPage" />}
        />
      </Switch>
    )
  }
  return (
    <Switch>
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
      <ProtectedRoute
        path="/r/:retreatIdx"
        render={(props) => (
          <RetreatProvider {...(props as any)}>
            <ProtectedRoute
              path={AppRoutes.getPath("RetreatHomePage")}
              exact
              component={RetreatOverviewPage}
            />
            <ProtectedRoute
              path={AppRoutes.getPath("PasswordResetPage")}
              exact
              component={AuthResetPage}
            />
            <ProtectedRoute
              path={AppRoutes.getPath("RetreatAttendeesPage")}
              exact
              component={RetreatAttendeesPage}
            />
            <ProtectedRoute
              path={AppRoutes.getPath("RetreatFlightsPage")}
              exact
              component={RetreatFlightsPage}
            />
            <ProtectedRoute
              path={AppRoutes.getPath("RetreatItineraryPage")}
              exact
              component={RetreatItineraryPage}
            />
            <ProtectedRoute
              path={[
                AppRoutes.getPath("LandingPageGeneratorConfig"),
                AppRoutes.getPath("LandingPageGeneratorPage"),
                AppRoutes.getPath("LandingPageGeneratorHome"),
              ]}
              component={LandingPageGenerator}
            />
            <ProtectedRoute
              path={AppRoutes.getPath("LodgingPage")}
              exact
              component={LodgingPage}
            />
            <ProtectedRoute
              path={AppRoutes.getPath("ProposalPage")}
              exact
              component={ProposalPage}
            />
            <ProtectedRoute
              path={[
                AppRoutes.getPath("AttendeeProfilePage"),
                AppRoutes.getPath("AttendeeProfileFlightsPage"),
              ]}
              exact
              component={AttendeeProfilePage}
            />
          </RetreatProvider>
        )}
      />

      {/* Routes that are "anti-protected" */}
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
      {/* <ProtectedRoute
        path={AppRoutes.getPath("RetreatPreferencesFormPage")}
        exact
        component={RetreatPreferencesFormPage}
      />
      <Route
        path={AppRoutes.getPath("NewRetreatFormPage")}
        exact
        component={NewRetreatFormPage}
      />
      
    
      /> */}
      <Route
        path={[
          AppRoutes.getPath("RetreatWebsiteHome"),
          AppRoutes.getPath("RetreatWebsitePage"),
        ]}
        exact
        component={RetreatWebsite}
      />
      <Route path={"*"} component={NotFound404Page} />
    </Switch>
  )
}
