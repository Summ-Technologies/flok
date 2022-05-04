import {Button} from "@material-ui/core"
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js"
import {useFormik} from "formik"
import {Editor} from "react-draft-wysiwyg"

type WYSIWYGBlockEditorProps = {
  block: any
  setBlocks: any
  blocks: any
}
function WYSIWYGBlockEditor(props: WYSIWYGBlockEditorProps) {
  // Block, rename, wysiwyg block editor
  let {setBlocks} = props
  let formik = useFormik({
    initialValues: {
      content: props.block.content
        ? EditorState.createWithContent(
            convertFromRaw(
              props.block.content as unknown as RawDraftContentState
            )
          )
        : EditorState.createEmpty(),
      type: "WYSIWYG",
    },
    onSubmit: (values) => {
      //convert from editor state to current content
      // console.log(
      //   JSON.stringify(
      //     {
      //       ...values,
      //       content: convertToRaw(values.content.getCurrentContent()),
      //     }.content
      //   )
      // )

      // For actual posting use JSON.stringify and JSON.parse
      setBlocks([
        ...props.blocks,
        {
          ...values,
          content: convertToRaw(values.content.getCurrentContent()),
          page_id: 0,
        },
      ])
    },
  })
  const editorStyle = {
    // height: "20rem",
    padding: "1rem",
    borderRadius: "8px",
    border: "2px solid gray",
    marginTop: 30,
    minWidth: "90%",
    minHeight: "200px",
    backgroundColor: "white",
  }
  const wrapperStyle = {
    margin: "10px",
    autofocus: "true",
    display: "flex",
    justifyContent: "center",
  }
  const toolbarStyle = {
    display: "flex",
    position: "fixed",
    zIndex: 10000,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    marginTop: -30,
  }
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Editor
          editorState={formik.values.content}
          onEditorStateChange={(val) => formik.setFieldValue(`content`, val)}
          wrapperStyle={wrapperStyle}
          editorStyle={editorStyle}
          toolbarStyle={toolbarStyle}
          toolbarOnFocus
          toolbar={{
            options: [
              "blockType",
              "inline",
              "list",
              "textAlign",
              "link",
              "colorPicker",
            ],
            inline: {
              inDropdown: true,
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            list: {inDropdown: true, options: ["unordered", "ordered"]},
            textAlign: {
              inDropdown: false,
              options: ["left", "center", "right"],
            },
            link: {inDropdown: false, options: ["link"]},
          }}
        />
        <Button type="submit">Save Block</Button>
      </form>
    </div>
  )
}
export default WYSIWYGBlockEditor
