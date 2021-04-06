import {
  Box,
  ClickAwayListener,
  IconButton,
  ListItem,
  Paper,
  Typography,
} from "@material-ui/core"
import Popper from "@material-ui/core/Popper"
import {createStyles, makeStyles} from "@material-ui/core/styles"
import {
  AddBoxOutlined,
  GroupRounded,
  IndeterminateCheckBoxOutlined,
  KeyboardArrowDownRounded,
  NightsStayRounded,
} from "@material-ui/icons"
import React from "react"
import AppButton from "../AppButton"
import AppList from "../AppList"

const useStyles = makeStyles((theme) => createStyles({}))

type AppNumberFilterProps = {
  count: number
  setCount: (newCount: number) => void
  icon: "nights" | "people" | JSX.Element
}

export default function AppNumberFilter(props: AppNumberFilterProps) {
  const classes = useStyles()
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
              <ListItem>
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => props.setCount(props.count - 1)}
                    disabled={props.count <= 1}>
                    <IndeterminateCheckBoxOutlined />
                  </IconButton>
                  <Typography variant="body1">{props.count}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => props.setCount(props.count + 1)}>
                    <AddBoxOutlined />
                  </IconButton>
                </Box>
              </ListItem>
            </AppList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}
