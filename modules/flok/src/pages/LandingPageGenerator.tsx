import {
  Box,
  Button,
  Drawer,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import {Add, ArrowBack, Settings} from "@material-ui/icons"
import {push, replace} from "connected-react-router"
import {useEffect, useState} from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {useDispatch} from "react-redux"
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from "react-router-dom"
import AppTabPanel from "../components/page/AppTabPanel"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import EditPageForm from "../components/retreat-website/EditPageForm"
import EditWebsiteForm from "../components/retreat-website/EditWebsiteForm"
import LandingPageEditForm from "../components/retreat-website/LandingPageEditForm"
import {AppRoutes} from "../Stack"
import {useQuery} from "../utils"
import {useRetreat} from "./misc/RetreatProvider"

type LandingPageGeneratorProps = RouteComponentProps<{
  retreatIdx: string
  config: string | undefined
}>
function LandingPageGenerator(props: LandingPageGeneratorProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let config = props.match.params.config
  let retreat = useRetreat()
  let {path, url} = useRouteMatch()
  console.log(config)

  let [tabQuery, setTabQuery] = useQuery("tab")
  let [tabValue, setTabValue] = useState<string | undefined | number>("Home")

  const [newPageTitle, setNewPageTitle] = useState("")

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
                    offset: 0,
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

  useEffect(() => {
    let TABS = pages.map((page) => page.title)
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "Home")
    console.log(tabValue, tabQuery)
  }, [tabQuery, setTabValue, pages, tabValue])
  const [toolbarOpen, setToolbarOpen] = useState(false)

  useEffect(() => {
    if (config !== undefined && !toolbarOpen) {
      setToolbarOpen(true)
    }
  }, [config, toolbarOpen])

  // let testHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
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
    addNew: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
    drawer: {
      // width: "200px",
    },
    pageNav: {
      marginLeft: theme.spacing(2),
      display: "flex",
    },
    pageTitleText: {
      paddingTop: theme.spacing(1.5),
      "&:hover": {
        textDecoration: "underline",
      },
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
  }))

  const classes = useStyles()
  let dispatch = useDispatch()

  let disabled =
    pages.map((page) => page.title).includes(newPageTitle) ||
    newPageTitle === ""

  function handleAddPage() {
    setPages([...pages, {title: newPageTitle, blocks: [], id: 1}])
    setNewPageTitle("")
  }
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <Drawer
          anchor="right"
          open={toolbarOpen}
          className={classes.drawer}
          onClose={() => {
            setToolbarOpen(false)
            dispatch(
              replace(
                AppRoutes.getPath("LandingPageGenerator", {
                  retreatIdx: retreatIdx.toString(),
                })
              )
            )
          }}
          SlideProps={{direction: "left", in: true}}>
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
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            config: "config",
                          }) +
                            "/add-page" +
                            (tabQuery ? `?tab=${tabQuery}` : "")
                        )
                      )
                    }}>
                    <Add fontSize="small" />
                  </IconButton>
                </div>
                {pages.map((page) => {
                  return (
                    <div className={classes.pageNav}>
                      <Typography
                        className={classes.pageTitleText}
                        onClick={() => {
                          dispatch(
                            push(
                              AppRoutes.getPath("LandingPageGenerator", {
                                retreatIdx: retreatIdx.toString(),
                              }) + `?tab=${page.title}`
                            )
                          )
                        }}>
                        {page.title}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          dispatch(
                            push(
                              AppRoutes.getPath("LandingPageGeneratorConfig", {
                                retreatIdx: retreatIdx.toString(),
                                config: "config",
                              }) +
                                "/edit-page/" +
                                page.id.toString() +
                                (tabQuery ? `?tab=${tabQuery}` : "")
                            )
                          )
                        }}>
                        <Settings fontSize="small" />
                      </IconButton>
                    </div>
                  )
                })}
                <Typography
                  variant="h4"
                  className={`${classes.pagesTitle} ${classes.underline}`}
                  onClick={() => {
                    dispatch(
                      push(
                        AppRoutes.getPath("LandingPageGeneratorConfig", {
                          retreatIdx: retreatIdx.toString(),
                          config: "config",
                        }) +
                          "/website-settings" +
                          (tabQuery ? `?tab=${tabQuery}` : "")
                      )
                    )
                  }}>
                  Settings
                </Typography>
              </div>
            </Route>
            <Route path={`${path}/add-page`}>
              <div className={classes.toolbarPage}>
                <div className={classes.pageTitleContainer}>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            config: "config",
                          }) + (tabQuery ? `?tab=${tabQuery}` : "")
                        )
                      )
                    }}>
                    <ArrowBack fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" className={classes.pagesTitle}>
                    Add New Page
                  </Typography>
                </div>

                <div className={classes.addNew}>
                  <TextField
                    variant="outlined"
                    value={newPageTitle}
                    onChange={(e: any) => {
                      setNewPageTitle(e.target.value)
                    }}
                    label="New Page Title"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddPage}
                    disabled={disabled}
                    size="small">
                    Add New Page
                  </Button>
                </div>
              </div>
            </Route>
            <Route path={`${path}/website-settings`}>
              <div className={classes.toolbarPage}>
                <div className={classes.pageTitleContainer}>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            config: "config",
                          }) + (tabQuery ? `?tab=${tabQuery}` : "")
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
            <Route path={`${path}/edit-page/:pageId`}>
              <div className={classes.toolbarPage}>
                <div className={classes.pageTitleContainer}>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        push(
                          AppRoutes.getPath("LandingPageGeneratorConfig", {
                            retreatIdx: retreatIdx.toString(),
                            config: "config",
                          }) + (tabQuery ? `?tab=${tabQuery}` : "")
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
                {retreat.company_name} Website - {tabValue}
              </Typography>
              <IconButton
                onClick={() => {
                  dispatch(
                    push(
                      AppRoutes.getPath("LandingPageGeneratorConfig", {
                        retreatIdx: retreatIdx.toString(),
                        config: "config",
                      }) + (tabQuery ? `?tab=${tabQuery}` : "")
                    )
                  )
                }}>
                <Settings fontSize="large"></Settings>
              </IconButton>
            </div>

            <Box>
              {/* <Tabs
                orientation={"horizontal"}
                className={classes.tabs}
                value={tabValue}
                onChange={(e, newVal) =>
                  setTabQuery(newVal === "home" ? null : newVal)
                }
                variant="fullWidth"
                indicatorColor="primary">
                {pages.map((page, i) => {
                  return (
                    <Tab
                      className={classes.tab}
                      value={page.title}
                      label={page.title}
                      key={i}
                    />
                  )
                })}
              </Tabs> */}
            </Box>
            {pages.map((page, i) => {
              return (
                <AppTabPanel
                  show={tabValue === page.title}
                  className={`${classes.tab}`}
                  renderDom="on-shown">
                  <LandingPageEditForm
                    page={page}
                    blocks={blocks}
                    setBlocks={setBlocks}
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
