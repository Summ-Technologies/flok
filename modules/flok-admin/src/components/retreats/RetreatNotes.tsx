import {
  Button,
  Divider,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core"
import {Send} from "@material-ui/icons"
import {FormikHelpers, useFormik} from "formik"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ThunkDispatch} from "redux-thunk"
import * as yup from "yup"
import {RootState} from "../../store"
import {getRetreatNotes, postRetreatNotes} from "../../store/actions/admin"
import {ApiAction} from "../../store/actions/api"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    maxHeight: "100%",
    flexDirection: "column",
    minHeight: 300,
    position: "relative",
  },
  header: {
    padding: theme.spacing(2),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  notesContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    flex: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    minHeight: 200,
  },
  notes: {
    display: "flex",
    flexDirection: "column",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
  note: {
    display: "flex",
    flexDirection: "column",
    "& > .MuiDivider-root": {
      marginTop: theme.spacing(0.25),
      marginBottom: theme.spacing(1),
    },
    "& > .MuiTypography-body1": {
      whiteSpace: "pre-wrap",
    },
  },
  newNoteForm: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    display: "flex",
    width: "100%",
    marginTop: "auto",
    padding: theme.spacing(2),
    "& .MuiButton-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiButton-root.Mui-disabled": {
      color: theme.palette.grey[400],
    },
  },
}))

type RetreatNotesProps = {retreatId: number}
export default function RetreatNotes(props: RetreatNotesProps) {
  let classes = useStyles(props)
  let dispatch: ThunkDispatch<any, any, any> = useDispatch()
  let salesNotes = useSelector(
    (state: RootState) => state.admin.notesByRetreat[props.retreatId]
  )

  useEffect(() => {
    if (salesNotes === undefined) {
      dispatch(getRetreatNotes(props.retreatId))
    }
  }, [salesNotes, dispatch, props.retreatId])

  const DateFormatter = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: "medium",
  })

  async function submitNewNote(
    values: {note: string},
    helpers: FormikHelpers<{note: string}>
  ) {
    let response = (await dispatch(
      postRetreatNotes(props.retreatId, values.note)
    )) as unknown as ApiAction
    if (!response.error) {
      helpers.resetForm()
      helpers.validateForm()
    } else {
      alert("error")
    }
  }

  let formik = useFormik({
    onSubmit: submitNewNote,
    initialValues: {note: ""},
    validationSchema: yup.object({note: yup.string().trim().required()}),
    validateOnMount: true,
    enableReinitialize: true,
  })

  return (
    <Paper className={classes.root} elevation={0}>
      <div className={classes.notesContainer}>
        <div className={classes.notes}>
          {salesNotes === undefined ? (
            <Typography>Loading...</Typography>
          ) : (
            salesNotes.map((note) => (
              <div className={classes.note}>
                <Typography variant="body2" color="textSecondary">
                  {DateFormatter.format(new Date(note.created_at))}
                </Typography>
                <Divider />
                <Typography variant="body1">{note.note}</Typography>
              </div>
            ))
          )}
        </div>
      </div>
      <form className={classes.newNoteForm} onSubmit={formik.handleSubmit}>
        <TextField
          value={formik.values.note}
          onChange={formik.handleChange}
          fullWidth
          id="note"
          variant="outlined"
          label="Add a note"
          multiline
          minRows={3}
          maxRows={6}
        />
        <Button type="submit" disabled={!formik.isValid}>
          <Send color="inherit" />
        </Button>
      </form>
    </Paper>
  )
}
