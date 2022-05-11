import {
  IconButton,
  ListItem,
  makeStyles,
  MenuItem,
  Popover,
} from "@material-ui/core"
import {Add} from "@material-ui/icons"
import React from "react"
import {FormQuestionTypeName, FormQuestionTypeValues} from "../../models/form"
import AppTypography from "../base/AppTypography"
import {useForm} from "./FormProvider"
import FormQuestionProvider from "./FormQuestionProvider"
import {FormHeader} from "./Headers"
import {RegFormBuilderQuestion} from "./Questions"

let useStyles = makeStyles((theme) => ({
  body: {
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0.5),
    },
  },
  builderForm: {
    margin: theme.spacing(1),
    "& > :not(:first-child)": {marginTop: theme.spacing(2)},
  },
  formSection: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
  },
  formQuestionTitleInput: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
  },
  formQuestionDescriptionInput: {
    ...theme.typography.body2,
  },
  addQuestionButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  addQuestionButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}))

type FormBuilderProps = {}
export default function FormBuilder(props: FormBuilderProps) {
  let classes = useStyles(props)
  let form = useForm()

  const [addQuestionAnchorEl, setAddQuestionAnchorEl] =
    React.useState<HTMLButtonElement | null>(null)
  const openAddQuestionPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAddQuestionAnchorEl(event.currentTarget)
  }
  const closeAddQuestionPopover = () => {
    setAddQuestionAnchorEl(null)
  }
  const addQuestionOpen = Boolean(addQuestionAnchorEl)

  return (
    <div className={classes.builderForm}>
      <div className={classes.formSection}>
        <FormHeader
          editable
          formId={form.id}
          title={form.title}
          description={form.description ?? ""}
        />
      </div>
      {form.questions.map((questionId) => (
        <div className={classes.formSection}>
          <FormQuestionProvider questionId={questionId}>
            <RegFormBuilderQuestion key={questionId} editable />
          </FormQuestionProvider>
        </div>
      ))}
      <div className={classes.addQuestionButtonContainer}>
        <IconButton
          color="inherit"
          className={classes.addQuestionButton}
          onClick={openAddQuestionPopover}>
          <Add />
        </IconButton>
        <Popover
          anchorEl={addQuestionAnchorEl}
          open={addQuestionOpen}
          onClose={closeAddQuestionPopover}>
          <div>
            <ListItem>
              <AppTypography fontWeight="bold" variant="body1">
                Add new question
              </AppTypography>
            </ListItem>
            {FormQuestionTypeValues.map((type) => (
              <MenuItem value={type} button onClick={closeAddQuestionPopover}>
                {FormQuestionTypeName[type] ?? type}
              </MenuItem>
            ))}
          </div>
        </Popover>
      </div>
    </div>
  )
}
