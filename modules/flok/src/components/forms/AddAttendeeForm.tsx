import {makeStyles} from "@material-ui/core"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {},
}))

type AddAttendeeFormProps = {}
export default function AddAttendeeForm(props: AddAttendeeFormProps) {
  let classes = useStyles(props)
  return <div className={classes.root}></div>
}
