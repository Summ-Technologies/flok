import {Link, makeStyles} from "@material-ui/core"
import React from "react"
import {RetreatModel} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
}))

type RetreatAccountHeaderProps = {
  retreat: RetreatModel
}
export default function RetreatAccountHeader(props: RetreatAccountHeaderProps) {
  let classes = useStyles(props)
  let retreatName = `${props.retreat.company_name}'s Retreat`
  let dates = "Jan 15 - 19, 2022"
  let numAttendees = 45
  return (
    <div className={classes.root}>
      <AppTypography variant="body1" fontWeight="bold" noWrap>
        {retreatName}
      </AppTypography>
      <AppTypography variant="body1" noWrap>
        {dates}
      </AppTypography>
      <AppTypography variant="body1" noWrap>
        ~{numAttendees} attendees
      </AppTypography>
      <AppTypography variant="body1">
        <Link
          href={
            AppRoutes.getPath("RetreatPreferencesFormPage", {
              retreatGuid: props.retreat.guid,
            }) +
            `?${new URLSearchParams({
              last: window.location.pathname + window.location.search,
            })}`
          }>
          Change
        </Link>
      </AppTypography>
    </div>
  )
}
