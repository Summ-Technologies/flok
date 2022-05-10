import {Button, makeStyles} from "@material-ui/core"
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js"
import {useFormik} from "formik"
import _ from "lodash"
import {useEffect} from "react"
import {Editor} from "react-draft-wysiwyg"
import {useDispatch} from "react-redux"
import {getBlock, patchBlock} from "../../store/actions/retreat"
import {useAttendeeLandingPageBlock} from "../../utils/retreatUtils"
import BeforeUnload from "../base/BeforeUnload"

let useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: "10px",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      // width: "80vw",
    },
  },
  toolbar: {
    display: "flex",
    position: "absolute",
    zIndex: 1000,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    marginTop: -30,
    [theme.breakpoints.down("sm")]: {
      marginTop: -20,
    },
    maxWidth: "70%",
    boxShadow: theme.shadows[2],
  },
  editor: {
    boxShadow: theme.shadows[1],

    autofocus: "true",
    width: "90%",
    // height: "20rem",
    padding: "1rem",
    borderRadius: "8px",
    // border: "2px solid gray",
    marginTop: 30,
    // minWidth: "90%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    minHeight: 200,
    backgroundColor: "white",
  },
  saveButton: {
    position: "absolute",
    boxShadow: theme.shadows[2],
    bottom: 40,
    zIndex: 10,
    right: 60,
    display: (props: any) =>
      _.isEqual(
        convertToRaw(props.values.content.getCurrentContent()),
        convertToRaw(props.initialValues.content.getCurrentContent())
      )
        ? "none"
        : "block",
  },
}))
type WYSIWYGBlockEditorProps = {
  blockId: number
  config: boolean
}

function WYSIWYGBlockEditor(props: WYSIWYGBlockEditorProps) {
  // Block, rename, wysiwyg block editor
  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(getBlock(props.blockId))
  }, [dispatch, props.blockId])
  let block = useAttendeeLandingPageBlock(props.blockId)

  let formik = useFormik({
    initialValues: {
      content: block?.content
        ? EditorState.createWithContent(
            convertFromRaw(block.content as unknown as RawDraftContentState)
          )
        : EditorState.createEmpty(),
      type: "WYSIWYG",
    },
    onSubmit: (values) => {
      //convert from editor state to current content
      dispatch(
        patchBlock(props.blockId, {
          content: convertToRaw(values.content.getCurrentContent()),
        })
      )
    },
  })

  useEffect(() => {
    formik.resetForm({
      values: {
        content: block?.content
          ? EditorState.createWithContent(
              convertFromRaw(block.content as unknown as RawDraftContentState)
            )
          : EditorState.createEmpty(),
        type: "WYSIWYG",
      },
    })
  }, [block])
  let classes = useStyles(formik)
  return (
    <div>
      <BeforeUnload
        when={
          !_.isEqual(
            convertToRaw(formik.values.content.getCurrentContent()),
            convertToRaw(formik.initialValues.content.getCurrentContent())
          ) && !props.config
        }
        message="Are you sure you wish to leave without saving your changes?"
      />
      <form onSubmit={formik.handleSubmit}>
        <Editor
          editorState={formik.values.content}
          onEditorStateChange={(val) => formik.setFieldValue(`content`, val)}
          wrapperClassName={classes.wrapper}
          editorClassName={classes.editor}
          toolbarClassName={classes.toolbar}
          toolbarOnFocus
          placeholder="Start typing here to create your page"
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
        <Button
          type="submit"
          className={classes.saveButton}
          variant="contained"
          color="primary">
          Save
        </Button>
      </form>
    </div>
  )
}
export default WYSIWYGBlockEditor
