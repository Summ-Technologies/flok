import {
  Box,
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
import ConfirmationModal from "../components/base/ConfirmationModal"
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
import {
  useAttendeeLandingPage,
  useAttendeeLandingWebsite,
} from "../utils/retreatUtils"
import NotFound404Page from "./misc/NotFound404Page"
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
}))

type LandingPageGeneratorProps = RouteComponentProps<{
  retreatIdx: string
  pageName: string
}>
function LandingPageGenerator(props: LandingPageGeneratorProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let pageName = props.match.params.pageName
  let retreat = useRetreat()
  let {path} = useRouteMatch()
  let config = path === AppRoutes.getPath("LandingPageGeneratorConfig")
  const classes = useStyles()
  let dispatch = useDispatch()
  let website = useAttendeeLandingWebsite(retreat.website_id)
  let page = useAttendeeLandingPage(parseInt(pageName))

  if (!website) {
    return <NotFound404Page />
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
                  pageName: pageName,
                })
              )
            )
          }}>
          <Switch>
            <Route exact path={path}>
              <div className={classes.toolbarPage}>
                <div style={{display: "flex"}}>
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
                              pageName: pageName,
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
                      pageName={pageName}
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
                      pageName: pageName,
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
                            pageName: pageName,
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
                            pageName: pageName,
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
                    pageName={pageName}
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
                {/* For now title case page name, later map and find page name casing */}
                {retreat.company_name} Website - {page?.title ?? pageName}
              </Typography>
              <IconButton
                onClick={() => {
                  dispatch(
                    push(
                      AppRoutes.getPath("LandingPageGeneratorConfig", {
                        retreatIdx: retreatIdx.toString(),
                        pageName: pageName,
                      })
                    )
                  )
                }}>
                <Settings fontSize="large"></Settings>
              </IconButton>
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
}))

type EditPageToolBarProps = RouteComponentProps<{
  pageId: string
  retreatIdx: string
  pageName: string
}>
function EditPageToolBar(props: EditPageToolBarProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let pageName = props.match.params.pageName
  let pageId = parseInt(props.match.params.pageId)
  let dispatch = useDispatch()
  let classes = useEditPageStyles()
  let retreat = useRetreat()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  let page = useAttendeeLandingPage(pageId)
  let website = useAttendeeLandingWebsite(retreat.website_id)
  async function handleDeletePage() {
    let deleteResult = (await dispatch(
      deletePage(pageId)
    )) as unknown as ApiAction
    if (!deleteResult.error) {
      handleCloseDeleteModal()
      dispatch(
        push(
          AppRoutes.getPath("LandingPageGeneratorConfig", {
            retreatIdx: retreatIdx.toString(),
            pageName:
              deleteResult.meta.pageId.toString() === pageName
                ? website?.page_ids[0].toString() ?? pageName
                : pageName,
          })
        )
      )
    }
  }
  function handleCloseDeleteModal() {
    setDeleteModalOpen(false)
  }
  return (
    <div className={classes.toolbarPage}>
      <ConfirmationModal
        open={deleteModalOpen}
        title="Delete Page?"
        text="Are you sure you wish to delete this page?  This action cannot be undone."
        onClose={handleCloseDeleteModal}
        onSubmit={handleDeletePage}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div className={classes.pageTitleContainer}>
          <IconButton
            onClick={() => {
              dispatch(
                push(
                  AppRoutes.getPath("LandingPageGeneratorConfig", {
                    retreatIdx: retreatIdx.toString(),
                    pageName: pageName,
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
          pageName={pageName}
        />
      </div>
    </div>
  )
}
