import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core"
import {
  ExpandLessRounded,
  ExpandMoreRounded,
  FavoriteBorderRounded,
  FlightRounded,
  HomeWorkRounded,
  PaymentRounded,
  PlaylistAddRounded,
} from "@material-ui/icons"
import {useRef, useState} from "react"
import AppTypography from "../base/AppTypography"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  collapse: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
}))

const NEXT_STEPS_LIST = [
  {
    icon: (
      <AppTypography variant="body1">
        <HomeWorkRounded fontSize="inherit" />
      </AppTypography>
    ),
    text: "Curated, work-optimized venue selection",
  },
  {
    icon: (
      <AppTypography variant="body1">
        <PaymentRounded fontSize="inherit" />
      </AppTypography>
    ),
    text:
      "Corporate cards - we'll consolidate expenses under 1 invoice instead of 100 reimbursements",
  },
  {
    icon: (
      <AppTypography variant="body1">
        <FlightRounded fontSize="inherit" />
      </AppTypography>
    ),
    text: "Coordinating and booking employee flights",
  },
  {
    icon: (
      <AppTypography variant="body1">
        <FavoriteBorderRounded fontSize="inherit" />
      </AppTypography>
    ),
    text: "Retreat best practices guide",
  },
  {
    icon: (
      <AppTypography variant="body1">
        <PlaylistAddRounded fontSize="inherit" />
      </AppTypography>
    ),
    text: "Add ons: event planners, videographers, swag",
  },
]

type RetreatNextStepsListProps = {}

export default function RetreatNextStepsList(props: RetreatNextStepsListProps) {
  const classes = useStyles(props)
  let [expanded, setExpanded] = useState(false)
  let listRef = useRef<HTMLDivElement | null>(null)

  let scrollBottomList = () =>
    listRef.current
      ? listRef.current.scrollIntoView({behavior: "smooth"})
      : undefined
  let expandList = () => {
    setExpanded(true)
  }
  let collapseList = () => setExpanded(false)

  type RetreatNextStepsListItemProps = {
    text: string
    leftIcon?: JSX.Element
    rightIcon?: JSX.Element
    header?: boolean
  }
  function RetreatNextStepsListItem(props: RetreatNextStepsListItemProps) {
    return (
      <Paper variant="outlined" elevation={1}>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={4}
          paddingTop={2}
          paddingBottom={2}>
          <Box display="flex">
            {props.leftIcon ? (
              <Box marginRight={1}>{props.leftIcon}</Box>
            ) : undefined}
            {props.header ? (
              <AppTypography variant="h3">{props.text}</AppTypography>
            ) : (
              <AppTypography bold variant="body1">
                {props.text}
              </AppTypography>
            )}
          </Box>
          {props.rightIcon ? props.rightIcon : undefined}
        </Box>
      </Paper>
    )
  }
  return (
    <Box className={classes.root}>
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center">
        <Box display="flex">
          <AppTypography variant="h3">Flok next steps</AppTypography>
          <Typography variant="h3">
            <IconButton
              size="small"
              onClick={expanded ? collapseList : expandList}>
              {expanded ? (
                <ExpandLessRounded fontSize="inherit" />
              ) : (
                <ExpandMoreRounded fontSize="inherit" />
              )}
            </IconButton>
          </Typography>
        </Box>
      </Box>
      <Collapse
        in={expanded}
        classes={{wrapperInner: classes.collapse}}
        onEntered={scrollBottomList}>
        {NEXT_STEPS_LIST.map((item, i) =>
          i !== NEXT_STEPS_LIST.length - 1 ? (
            <RetreatNextStepsListItem
              key={i}
              leftIcon={item.icon}
              text={item.text}
            />
          ) : (
            <div ref={listRef} key={i}>
              <RetreatNextStepsListItem leftIcon={item.icon} text={item.text} />
            </div>
          )
        )}
      </Collapse>
    </Box>
  )
}
