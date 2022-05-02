import {
  Box,
  Button,
  Drawer,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core"
import {Settings} from "@material-ui/icons"
import {useEffect, useState} from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
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
import EditWebsiteModal from "../components/retreat-website/EditWebsiteModal"
import LandingPageEditForm from "../components/retreat-website/LandingPageEditForm"
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

  const [pages, setPages] = useState([{title: "Home", blocks: [], id: 0}])

  const [editWebsiteModalOpen, setEditWebsiteModalOpen] = useState(false)
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    let TABS = pages.map((page) => page.title)
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "Home")
    console.log(tabValue, tabQuery)
  }, [tabQuery, setTabValue, pages])

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
      gap: theme.spacing(2),
    },
    drawer: {
      width: "200px",
    },
  }))

  const classes = useStyles()

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
        <EditWebsiteModal
          open={editWebsiteModalOpen}
          handleClose={() => setEditWebsiteModalOpen(false)}
        />
        <Drawer
          anchor="right"
          open={config !== undefined}
          className={classes.drawer}
          onClose={() => {
            alert("hi")
          }}>
          asdf
          <Switch>
            <Route exact path={path}>
              <h3>Please select a topic.</h3>
            </Route>
            <Route path={`${path}/page1`}>
              <h3>No way</h3>
            </Route>
            <Route path={`${path}/page2`}>
              <h3>Yes way</h3>
            </Route>
          </Switch>
        </Drawer>

        <Box>
          <div className={classes.root}>
            <div className={classes.header}>
              <Typography variant="h1">
                {retreat.company_name} Retreat Website
              </Typography>
              <IconButton
                onClick={() => {
                  setEditWebsiteModalOpen(true)
                }}>
                <Settings fontSize="large"></Settings>
              </IconButton>
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

            <Box>
              <Tabs
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
              </Tabs>
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
