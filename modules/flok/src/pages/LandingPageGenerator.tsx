import {
  Box,
  Drawer,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {Add, ArrowBack, Settings} from "@material-ui/icons"
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
import AppTabPanel from "../components/page/AppTabPanel"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import AddPageForm from "../components/retreat-website/AddPageForm"
import EditPageForm from "../components/retreat-website/EditPageForm"
import EditWebsiteForm from "../components/retreat-website/EditWebsiteForm"
import LandingPageEditForm from "../components/retreat-website/LandingPageEditForm"
import {AppRoutes} from "../Stack"
import {useRetreat} from "./misc/RetreatProvider"
type LandingPageGeneratorProps = RouteComponentProps<{
  retreatIdx: string
  config: string | undefined
  pageName: string
}>
function LandingPageGenerator(props: LandingPageGeneratorProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let pageName = props.match.params.pageName
  let retreat = useRetreat()
  let {path} = useRouteMatch()
  let config = path === AppRoutes.getPath("LandingPageGeneratorConfig")
  console.log(path, AppRoutes.getPath("LandingPageGeneratorConfig"))
  console.log(config)

  const [pages, setPages] = useState([
    {
      title: "Home",
      blocks: [
        {
          content: {
            blocks: [
              {
                key: "9492t",
                text: "Brex Retreat 2022",
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "5rk2",
                text: "September 21st - September 29th",
                type: "header-three",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "3viqq",
                text: "First ever retreat join us here! ",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {
                  "text-align": "start",
                },
              },
              {
                key: "b93ui",
                text: "Resort Info",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "fc2en",
                text: "This is some resort info. Lorem ipsum dolor word bacon people something blah zebra fox jumps over the lazy dog In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "dqbd2",
                text: "Retreat Link ",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [
                  {
                    offset: 10,
                    length: 12,
                    key: 0,
                  },
                ],
                data: {},
              },
              {
                key: "1kjeg",
                text: "",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "fk4v9",
                text: "Packing List:",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "60bes",
                text: "Bathing Suit",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "9v3fi",
                text: "Toiletries",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "ppnk",
                text: "Sneakers",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "39c7j",
                text: "Workout clothes",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "3a7t8",
                text: "Laptop",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
            entityMap: {
              "0": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                  url: "http://www.google.com",
                  targetOption: "_blank",
                },
              },
            },
          },
          type: "WYSIWYG",
          id: 1,
          page_id: 0,
        },
      ],
      id: 0,
    },
    {title: "FAQ", blocks: [], id: 1},
    {title: "Resort Details", blocks: [], id: 2},
  ])

  const [blocks, setBlocks] = useState(pages.map((page) => page.blocks).flat())

  // const [toolbarOpen, setToolbarOpen] = useState()

  // useEffect(() => {
  //   if (config && !toolbarOpen) {
  //     setToolbarOpen(true)
  //     console.log("ss")
  //   }
  // }, [config, toolbarOpen, path])

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

  const classes = useStyles()
  let dispatch = useDispatch()

  function titleCase(str: string) {
    let strArr = str.toLowerCase().split(" ")
    for (var i = 0; i < strArr.length; i++) {
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1)
    }
    return strArr.join(" ")
  }

  // console.log(toolbarOpen)
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <Drawer
          anchor="right"
          open={config}
          onClose={() => {
            // setToolbarOpen(false)
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
                              config: "config",
                              pageName: pageName,
                            }
                          )
                        )
                      )
                    }}>
                    <Add fontSize="small" />
                  </IconButton>
                </div>
                {pages.map((page) => {
                  return (
                    <div className={classes.pageNav}>
                      <Link
                        className={classes.pageTitleText}
                        component={RouterLink}
                        to={AppRoutes.getPath("LandingPageGeneratorPage", {
                          retreatIdx: retreatIdx.toString(),
                          pageName: page.title,
                        })}>
                        <Typography>{page.title}</Typography>
                      </Link>
                      <IconButton
                        onClick={() => {
                          dispatch(
                            push(
                              AppRoutes.getPath(
                                "LandingPageGeneratorConfigPageSettings",
                                {
                                  retreatIdx: retreatIdx.toString(),
                                  config: "config",
                                  pageName: pageName,
                                  pageId: page.id.toString(),
                                }
                              )
                            )
                          )
                        }}>
                        <Settings fontSize="small" />
                      </IconButton>
                    </div>
                  )
                })}
                <Link
                  className={classes.headerLink}
                  component={RouterLink}
                  to={AppRoutes.getPath(
                    "LandingPageGeneratorConfigWebsiteSettings",
                    {
                      retreatIdx: retreatIdx.toString(),
                      config: "config",
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
                            config: "config",
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
                  <AddPageForm website_id={0} pages={pages} />
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
                            config: "config",
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
                  <EditWebsiteForm />
                </div>
              </div>
            </Route>
            <Route
              path={AppRoutes.getPath(
                "LandingPageGeneratorConfigPageSettings"
              )}>
              <div className={classes.toolbarPage}>
                <div className={classes.pageTitleContainer}>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            config: "config",
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

                <div className={classes.editWebsiteFormWrapper}>
                  <EditPageForm />
                </div>
              </div>
            </Route>
          </Switch>
        </Drawer>

        <Box>
          <div className={classes.root}>
            <div className={classes.header}>
              <Typography variant="h1">
                {/* For now title case page name, later map and find page name casing */}
                {retreat.company_name} Website - {titleCase(pageName)}
              </Typography>
              <IconButton
                onClick={() => {
                  dispatch(
                    push(
                      AppRoutes.getPath("LandingPageGeneratorConfig", {
                        retreatIdx: retreatIdx.toString(),
                        config: "config",
                        pageName: pageName,
                      })
                    )
                  )
                }}>
                <Settings fontSize="large"></Settings>
              </IconButton>
            </div>
            {pages.map((page, i) => {
              return (
                <AppTabPanel
                  show={pageName.toLowerCase() === page.title.toLowerCase()}
                  className={`${classes.tab}`}
                  renderDom="on-shown">
                  <LandingPageEditForm
                    page={page}
                    blocks={blocks}
                    setBlocks={setBlocks}
                    config={config}
                  />
                </AppTabPanel>
              )
            })}
          </div>
        </Box>
      </PageBody>
    </PageContainer>
  )
}
export default LandingPageGenerator
