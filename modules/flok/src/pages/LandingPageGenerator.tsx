import {
  Box,
  Button,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core"
import {EditorState} from "draft-js"
import {useFormik} from "formik"
import {useEffect, useState} from "react"
import {Editor} from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {RouteComponentProps} from "react-router-dom"
import AppTabPanel from "../components/page/AppTabPanel"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
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
  const TABS = ["profile", "flights"]

  const [newPageTitle, setNewPageTitle] = useState("")

  // let testcontent = `{"blocks":[{"key":"cs1j4","text":"asd;lfkmadsf","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e1826","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8bv1r","text":"adfs","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"aoqg5","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bq87t","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5iarr","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"907or","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNe8mkQDAyfUrMt5hhqqmhYlEAs8MeiBC5grpnoICI3g&s","height":"auto","width":"auto"}}}}`
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createWithContent(convertFromRaw(JSON.parse(testcontent)))
  // )

  let formik = useFormik({
    initialValues: {
      header_image_link: "",
      pages: [
        {
          title: "Home",
          chunks: [EditorState.createEmpty()],
        },
      ],
    },
    onSubmit: (values) => {
      //convert from editor state to current content
      console.log(
        JSON.stringify({
          ...values,
          pages: values.pages.map((page) => {
            return {
              ...page,
              chunks: page.chunks.map((es) => es.getCurrentContent()),
            }
          }),
        })
      )
    },
  })

  useEffect(() => {
    let TABS = formik.values.pages.map((page) => page.title)
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "Home")
  }, [tabQuery, setTabValue])

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
  const editorStyle = {
    // height: "20rem",
    padding: "1rem",
  }
  const wrapperStyle = {
    borderRadius: "4px",
    border: "2px solid black",
    margin: "10px",
    autofocus: "true",
  }
  const toolbarStyle = {
    display: "flex",
    justifyContent: "space-between",
  }
  const classes = useStyles()

  function handleAdd() {
    formik.setFieldValue("pages", [
      ...formik.values.pages,
      {
        title: newPageTitle,
        chunks: [EditorState.createEmpty()],
      },
    ])
    setNewPageTitle("")
  }
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <Box>
          <div className={classes.root}>
            <Typography variant="h3">
              {" "}
              Create {retreat.company_name} Retreat Website
            </Typography>
          </div>
        </Box>
        {/*  formik.setFieldValue(`trip_legs`, [
      ...formik.values.trip_legs,
      {
        airline: "",
        dep_airport: "",
        arr_airport: "",
        flight_num: "",
        dep_datetime: "",
        arr_datetime: "",
        duration: "",
      },
    ]) */}

        {/* <div dangerouslySetInnerHTML={{__html: testHTML}}></div> */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            value={formik.values.header_image_link}
            id={`header_image_link`}
            onChange={formik.handleChange}
            variant="outlined"
            label="Banner Image Link"
          />
          <div style={{display: "flex", alignItems: "center", margin: "20px"}}>
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
              onClick={handleAdd}
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
                setTabQuery(newVal === "profile" ? null : newVal)
              }
              variant="fullWidth"
              indicatorColor="primary">
              {formik.values.pages.map((page, i) => {
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
          {formik.values.pages.map((page, i) => {
            return (
              <AppTabPanel
                show={tabValue === page.title}
                className={`${classes.tab}`}
                renderDom="on-shown">
                <Editor
                  editorState={formik.values.pages[i].chunks[0]}
                  onEditorStateChange={(val) =>
                    formik.setFieldValue(`pages[${i}].chunks[0]`, val)
                  }
                  wrapperStyle={wrapperStyle}
                  editorStyle={editorStyle}
                  toolbarStyle={toolbarStyle}
                />
              </AppTabPanel>
            )
          })}
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </form>
      </PageBody>
    </PageContainer>
  )
}
export default LandingPageGenerator
