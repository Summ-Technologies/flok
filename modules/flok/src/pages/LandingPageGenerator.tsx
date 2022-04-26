import {Box, Button, makeStyles, Typography} from "@material-ui/core"
import {convertToRaw, EditorState} from "draft-js"
import draftToHtml from "draftjs-to-html"
import {useFormik} from "formik"
import {useState} from "react"
import {Editor} from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {RouteComponentProps} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {useRetreat} from "./misc/RetreatProvider"

type LandingPageGeneratorProps = RouteComponentProps<{
  retreatIdx: string
}>
function LandingPageGenerator(props: LandingPageGeneratorProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  type retreatWebsitePage = {
    title: string
    blocks: string[]
  }

  let formik = useFormik({
    initialValues: {
      header_image_link: "",
      pages: [],
    },
    onSubmit: (values) => {
      console.log(values)
    },
  })

  let testcontent = `{"blocks":[{"key":"cs1j4","text":"asd;lfkmadsf","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e1826","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8bv1r","text":"adfs","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"aoqg5","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bq87t","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5iarr","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"907or","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNe8mkQDAyfUrMt5hhqqmhYlEAs8MeiBC5grpnoICI3g&s","height":"auto","width":"auto"}}}}`

  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createWithContent(convertFromRaw(JSON.parse(testcontent)))
  // )
  let testHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
  let useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
      flex: 1,
      overflow: "hidden",
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
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <Box>
          <div className={classes.root}>
            <Typography variant="h3"> Create Retreat Website</Typography>
          </div>
        </Box>

        <div dangerouslySetInnerHTML={{__html: testHTML}}></div>
        {/* {JSON.stringify(convertToRaw(editorState.getCurrentContent()))} */}
        <form onSubmit={formik.handleSubmit}>
          <Editor
            // toolbar={{
            //   options: ["inline", "blockType", "fontSize", "fontFamily", "image"],
            //   inline: {
            //     options: [
            //       "bold",
            //       "italic",
            //       "underline",
            //       "strikethrough",
            //       "monospace",
            //     ],
            //     bold: {
            //       className: "bordered-option-classname",
            //     },
            //     italic: {className: "bordered-option-classname"},
            //     underline: {className: "bordered-option-classname"},
            //     strikethrough: {className: "bordered-option-classname"},
            //     code: {className: "bordered-option-classname"},
            //   },
            //   blockType: {
            //     className: "bordered-option-classname",
            //   },
            //   fontSize: {
            //     className: "bordered-option-classname",
            //   },
            //   fontFamily: {
            //     className: "bordered-option-classname",
            //   },
            // }}
            editorState={editorState}
            onEditorStateChange={(e) => {
              setEditorState(e)
              formik.handleChange(e)
            }}
            wrapperStyle={wrapperStyle}
            editorStyle={editorStyle}
            toolbarStyle={toolbarStyle}
          />
          <Button
            onClick={() => {
              console.log(
                JSON.stringify(convertToRaw(editorState.getCurrentContent()))
              )
            }}
            variant="contained">
            Submit
          </Button>
        </form>
      </PageBody>
    </PageContainer>
  )
}
export default LandingPageGenerator
