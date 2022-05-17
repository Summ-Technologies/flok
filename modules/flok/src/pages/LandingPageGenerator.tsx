import {
  Box,
  Button,
  Drawer,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {Add, ArrowBack, Delete, Settings} from "@material-ui/icons"
import {push} from "connected-react-router"
import {useState} from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {useDispatch} from "react-redux"
import {
  Link as RouterLink,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from "react-router-dom"
import AppConfirmationModal from "../components/base/ConfirmationModal"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import AddPageForm from "../components/retreat-website/AddPageForm"
import EditPageForm from "../components/retreat-website/EditPageForm"
import EditWebsiteForm from "../components/retreat-website/EditWebsiteForm"
import LandingPageEditForm from "../components/retreat-website/LandingPageEditForm"
import PageWebsiteLink from "../components/retreat-website/PageWebsiteLink"
import {AppRoutes} from "../Stack"
import {ApiAction} from "../store/actions/api"
import {deletePage} from "../store/actions/retreat"
import {titleToNavigation} from "../utils"
import {
  useAttendeeLandingPage,
  useAttendeeLandingWebsite,
} from "../utils/retreatUtils"
import CreateRetreatWebsite from "./CreateRetreatWebsite"
import RedirectPage from "./misc/RedirectPage"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minWidth: "175px",
  },
  tab: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(1.5),
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageNav: {
    marginLeft: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
  },
  pageTitleText: {
    paddingTop: theme.spacing(1.5),
    color: theme.palette.common.black,
  },
  pagesTitle: {
    paddingTop: theme.spacing(1.3),
  },
  toolbarPage: {
    padding: theme.spacing(2),
    minWidth: 300,
  },
  underline: {
    "&:hover": {
      textDecoration: "underline",
      textDecorationColor: theme.palette.primary,
    },
  },
  editWebsiteFormWrapper: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  pageTitleContainer: {
    display: "flex",
  },
  headerLink: {
    color: theme.palette.common.black,
  },
  topRightOptions: {display: "flex", alignItems: "center"},
  viewPageLink: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  toolbarPageFlexBox: {
    display: "flex",
  },
}))

type LandingPageGeneratorProps = RouteComponentProps<{
  retreatIdx: string
  currentPageId: string
}>
function LandingPageGenerator(props: LandingPageGeneratorProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let currentPageId = props.match.params.currentPageId
  let retreat = useRetreat()
  let {path} = useRouteMatch()
  let config = path === AppRoutes.getPath("LandingPageGeneratorConfig")
  const classes = useStyles()
  let dispatch = useDispatch()
  let website = useAttendeeLandingWebsite(retreat.attendees_website_id ?? -1)
  let page = useAttendeeLandingPage(parseInt(currentPageId))

  if (!website || !website.page_ids[0]) {
    return <CreateRetreatWebsite {...props} />
  }
  if (!currentPageId) {
    return (
      <RedirectPage
        pageName="LandingPageGeneratorPage"
        pathParams={{
          retreatIdx: retreatIdx.toString(),
          currentPageId: website.page_ids[0].toString(),
        }}
      />
    )
  }
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <Drawer
          anchor="right"
          open={config}
          onClose={() => {
            dispatch(
              push(
                AppRoutes.getPath("LandingPageGeneratorPage", {
                  retreatIdx: retreatIdx.toString(),
                  currentPageId: currentPageId,
                })
              )
            )
          }}>
          <Switch>
            <Route exact path={path}>
              <div className={classes.toolbarPage}>
                <div className={classes.toolbarPageFlexBox}>
                  <Typography variant="h4" className={classes.pagesTitle}>
                    Pages
                  </Typography>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath(
                            "LandingPageGeneratorConfigAddPage",
                            {
                              retreatIdx: retreatIdx.toString(),
                              currentPageId: currentPageId,
                            }
                          )
                        )
                      )
                    }}>
                    <Add fontSize="small" />
                  </IconButton>
                </div>
                {website.page_ids.map((pageId) => {
                  return (
                    <PageWebsiteLink
                      pageId={pageId}
                      currentPageId={currentPageId}
                      retreatIdx={retreatIdx}
                    />
                  )
                })}
                <Link
                  className={classes.headerLink}
                  component={RouterLink}
                  to={AppRoutes.getPath(
                    "LandingPageGeneratorConfigWebsiteSettings",
                    {
                      retreatIdx: retreatIdx.toString(),
                      currentPageId: currentPageId,
                    }
                  )}>
                  <Typography
                    variant="h4"
                    className={`${classes.pagesTitle} ${classes.underline}`}>
                    Website Settings
                  </Typography>
                </Link>
              </div>
            </Route>
            <Route
              path={AppRoutes.getPath("LandingPageGeneratorConfigAddPage")}>
              <div className={classes.toolbarPage}>
                <div className={classes.pageTitleContainer}>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            currentPageId: currentPageId,
                          })
                        )
                      )
                    }}>
                    <ArrowBack fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" className={classes.pagesTitle}>
                    Add New Page
                  </Typography>
                </div>

                <div>
                  <AddPageForm websiteId={website.id} retreatIdx={retreatIdx} />
                </div>
              </div>
            </Route>
            <Route
              path={AppRoutes.getPath(
                "LandingPageGeneratorConfigWebsiteSettings"
              )}>
              <div className={classes.toolbarPage}>
                <div className={classes.pageTitleContainer}>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            currentPageId: currentPageId,
                          })
                        )
                      )
                    }}>
                    <ArrowBack fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" className={classes.pagesTitle}>
                    Website Settings
                  </Typography>
                </div>

                <div className={classes.editWebsiteFormWrapper}>
                  <EditWebsiteForm
                    websiteId={website.id}
                    retreatIdx={retreatIdx}
                    currentPageId={currentPageId}
                  />
                </div>
              </div>
            </Route>
            <Route
              path={AppRoutes.getPath("LandingPageGeneratorConfigPageSettings")}
              component={EditPageToolBar}></Route>
          </Switch>
        </Drawer>

        <Box>
          <div className={classes.root}>
            <div className={classes.header}>
              <Typography variant="h1">
                {retreat.company_name} Website - {page?.title ?? currentPageId}
              </Typography>
              <div className={classes.topRightOptions}>
                <Link
                  className={classes.viewPageLink}
                  href={AppRoutes.getPath("RetreatWebsitePage", {
                    retreatName: website.name,
                    pageName: titleToNavigation(page?.title ?? "home"),
                  })}
                  target="_blank">
                  <Button variant="outlined" color="primary" size="small">
                    View Page
                  </Button>
                </Link>

                <IconButton
                  onClick={() => {
                    dispatch(
                      push(
                        AppRoutes.getPath("LandingPageGeneratorConfig", {
                          retreatIdx: retreatIdx.toString(),
                          currentPageId: currentPageId,
                        })
                      )
                    )
                  }}>
                  <Settings fontSize="large"></Settings>
                </IconButton>
              </div>
            </div>
            {page && <LandingPageEditForm pageId={page?.id} config={config} />}
          </div>
        </Box>
      </PageBody>
    </PageContainer>
  )
}
export default LandingPageGenerator

let useEditPageStyles = makeStyles((theme) => ({
  pagesTitle: {
    paddingTop: theme.spacing(1.3),
  },
  toolbarPage: {
    padding: theme.spacing(2),
    minWidth: 300,
  },
  editWebsiteFormWrapper: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  pageTitleContainer: {
    display: "flex",
  },
  pageSettingsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}))

type EditPageToolBarProps = RouteComponentProps<{
  pageId: string
  retreatIdx: string
  currentPageId: string
}>
function EditPageToolBar(props: EditPageToolBarProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let currentPageId = props.match.params.currentPageId
  let pageId = parseInt(props.match.params.pageId)
  let dispatch = useDispatch()
  let classes = useEditPageStyles()
  let retreat = useRetreat()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  let page = useAttendeeLandingPage(pageId)
  let website = useAttendeeLandingWebsite(retreat.attendees_website_id ?? -1)
  async function handleDeletePage() {
    let deleteResult = (await dispatch(
      deletePage(pageId)
    )) as unknown as ApiAction
    if (!deleteResult.error) {
      setDeleteModalOpen(false)
      dispatch(
        push(
          AppRoutes.getPath("LandingPageGeneratorConfig", {
            retreatIdx: retreatIdx.toString(),
            currentPageId:
              deleteResult.meta.pageId.toString() === currentPageId
                ? website?.page_ids[0].toString() ?? currentPageId
                : currentPageId,
          })
        )
      )
    }
  }

  return (
    <div className={classes.toolbarPage}>
      <AppConfirmationModal
        open={deleteModalOpen}
        title="Delete Page?"
        text="Are you sure you wish to delete this page?  This action cannot be undone."
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleDeletePage}
      />
      <div className={classes.pageSettingsContainer}>
        <div className={classes.pageTitleContainer}>
          <IconButton
            onClick={() => {
              dispatch(
                push(
                  AppRoutes.getPath("LandingPageGeneratorConfig", {
                    retreatIdx: retreatIdx.toString(),
                    currentPageId: currentPageId,
                  })
                )
              )
            }}>
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography variant="h4" className={classes.pagesTitle}>
            Page Settings
          </Typography>
        </div>
        {page?.title.toLowerCase() !== "home" && (
          <IconButton onClick={() => setDeleteModalOpen(true)}>
            <Delete />
          </IconButton>
        )}
      </div>

      <div className={classes.editWebsiteFormWrapper}>
        <EditPageForm
          pageId={pageId}
          retreatIdx={retreatIdx.toString()}
          currentPageId={currentPageId}
        />
      </div>
    </div>
  )
}
