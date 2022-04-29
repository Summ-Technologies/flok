import {
  Box,
  Button,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core"
import {useEffect, useState} from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {RouteComponentProps} from "react-router-dom"
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
}>
function LandingPageGenerator(props: LandingPageGeneratorProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  let [tabQuery, setTabQuery] = useQuery("tab")
  let [tabValue, setTabValue] = useState<string | undefined | number>("Home")

  const [newPageTitle, setNewPageTitle] = useState("")

  const [pages, setPages] = useState([{title: "Home", blocks: [], id: 0}])

  // let testcontent = `{"blocks":[{"key":"cs1j4","text":"asd;lfkmadsf","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e1826","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8bv1r","text":"adfs","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"aoqg5","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bq87t","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5iarr","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"907or","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNe8mkQDAyfUrMt5hhqqmhYlEAs8MeiBC5grpnoICI3g&s","height":"auto","width":"auto"}}}}`
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createWithContent(convertFromRaw(JSON.parse(testcontent)))
  // )

  const [editWebsiteModalOpen, setEditWebsiteModalOpen] = useState(false)
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    let TABS = pages.map((page) => page.title)
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "Home")
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
        <Box>
          <div className={classes.root}>
            <Typography variant="h3">
              {" "}
              Create {retreat.company_name} Retreat Website
            </Typography>
          </div>
        </Box>
        <Button
          onClick={() => {
            setEditWebsiteModalOpen(true)
          }}>
          Open Edit Modal
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPage}
          disabled={disabled}
          size="small">
          Add New Page
        </Button>

        <div style={{display: "flex", alignItems: "center"}}>
          <TextField
            variant="outlined"
            value={newPageTitle}
            onChange={(e: any) => {
              setNewPageTitle(e.target.value)
            }}
            label="New Page Title"
            size="small"
          />
        </div>

        <Box>
          <Tabs
            orientation={"horizontal"}
            className={classes.tabs}
            value={tabValue}
            onChange={(e, newVal) =>
              setTabQuery(newVal === "profile" ? null : newVal)
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
      </PageBody>
    </PageContainer>
  )
}
export default LandingPageGenerator
