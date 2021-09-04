import {Chip, makeStyles} from "@material-ui/core"
import React from "react"
import AppTypography from "./AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {},
  chip: {},
  labelContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedFilterLabel: {
    marginLeft: theme.spacing(0.5),
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: 2,
    paddingBottom: 2,
    minWidth: 30,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  popper: {},
}))

export type AppFilterProps = {
  filter: string
  filterSelected?: string
  open?: boolean
  onClick: () => void
  popper: JSX.Element
}
export default function AppFilter(props: AppFilterProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <Chip
        // ref={}
        className={classes.chip}
        label={
          <div className={classes.labelContainer}>
            <AppTypography variant="body2">{props.filter}</AppTypography>
            {props.filterSelected ? (
              <div className={classes.selectedFilterLabel}>
                <AppTypography variant="body2">
                  {props.filterSelected}
                </AppTypography>
              </div>
            ) : undefined}
          </div>
        }
        variant="outlined"
        clickable
      />
      {/* <Popper
      // anchorEl={}
      >
        <div>Test</div>
      </Popper> */}
    </div>
  )
}
