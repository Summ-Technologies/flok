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
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Editor
          editorState={formik.values.content}
          onEditorStateChange={(val) => formik.setFieldValue(`content`, val)}
          wrapperStyle={wrapperStyle}
          editorStyle={editorStyle}
          toolbarStyle={toolbarStyle}
        />
        <Button type="submit">Save Block</Button>
      </form>
    </div>
  )
}
export default WYSIWYGBlockEditor
