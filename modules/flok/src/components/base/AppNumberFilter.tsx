import {Box, ClickAwayListener, Paper, Typography} from "@material-ui/core"
import Popper from "@material-ui/core/Popper"
import {
  GroupRounded,
  KeyboardArrowDownRounded,
  NightsStayRounded,
} from "@material-ui/icons"
import React from "react"
import AppList, {AppListItem} from "../base/AppList"
import AppButton from "./AppButton"
import AppNumberCounter from "./AppNumberCounter"

type AppNumberFilterProps = {
  count: number
  setCount: (newCount: number) => void
  icon: "nights" | "people" | JSX.Element
}

/**
 * Displays the icon + count in icon button. On click displays pop up with AppNumberCounter element
 */
export default function AppNumberFilter(props: AppNumberFilterProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  let Icon =
    props.icon === "nights" ? (
      <NightsStayRounded fontSize="inherit" />
    ) : props.icon === "people" ? (
      <GroupRounded fontSize="inherit" />
    ) : (
      props.icon
    )

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const closePopper = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popper" : undefined

  return (
    <Box>
      <AppButton aria-describedby={id} onClick={handleClick}>
        <Box display="flex" alignItems="center">
          <Typography variant="body1">
            {Icon} {props.count} <KeyboardArrowDownRounded fontSize="inherit" />
          </Typography>
        </Box>
      </AppButton>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={closePopper}>
          <Paper elevation={1}>
            <AppList>
              <AppListItem
                body={
                  <AppNumberCounter
                    count={props.count}
                    onUpdateCount={props.setCount}
                  />
                }
              />
            </AppList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}
