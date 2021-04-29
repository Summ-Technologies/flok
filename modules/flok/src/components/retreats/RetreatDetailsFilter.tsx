import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Divider,
  makeStyles,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {SyntheticEvent, useEffect, useRef, useState} from "react"
import AppButton from "../base/AppButton"
import AppList, {AppListItem} from "../base/AppList"
import AppNumberCounter from "../base/AppNumberCounter"
import AppTypography from "../base/AppTypography"

const FILTER_HEIGHT_PX = 70
const FILTER_HEIGHT_SM = 50

const useDetailStyles = makeStyles((theme) => ({
  filterButtonFocused: {},
  filterButtonBody: {},
  filterButton: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "4px",
    marginBottom: "4px",
    "&:first-child": {
      marginLeft: "4px",
    },
    borderRadius: (props: RetreatDetailsFilterItemProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM / 2 : FILTER_HEIGHT_PX / 2,
    "&:hover, &$filterButtonFocused, &.active": {
      boxShadow: theme.shadows[1],
      "& > $filterButtonBody": {
        borderLeft: "none",
      },
    },
  },
}))

type RetreatDetailsFilterItemProps = {
  title: string
  label: string
  size?: "large" | "small"
  value: number
  setValue: (newVal: number) => void
}

function RetreatDetailsFilterItem(props: RetreatDetailsFilterItemProps) {
  let classes = useDetailStyles(props)
  let [open, setOpen] = useState(() => false)
  let anchorEl = useRef<HTMLButtonElement>(null)
  const openPopper = (e: SyntheticEvent<HTMLButtonElement>) => {
    setOpen(true)
  }
  const closePopper = () => {
    setOpen(false)
  }
  return (
    <>
      <ButtonBase
        ref={anchorEl}
        aria-describedby={open ? "simple-popper" : undefined}
        className={clsx(classes.filterButton, open ? "active" : undefined)}
        focusVisibleClassName={classes.filterButtonFocused}
        onClick={openPopper}>
        <Box
          className={classes.filterButtonBody}
          display="flex"
          flexDirection="column"
          textAlign="left"
          paddingLeft={`${
            props.size === "small" ? FILTER_HEIGHT_SM / 2 : FILTER_HEIGHT_PX / 2
          }px`}>
          <AppTypography
            bold
            variant={props.size === "small" ? "caption" : "body2"}>
            {props.title}
          </AppTypography>
          <AppTypography variant={props.size === "small" ? "caption" : "body1"}>
            {props.value} {props.label}
          </AppTypography>
        </Box>
      </ButtonBase>
      <Popper
        id="simple-popper"
        open={open}
        anchorEl={anchorEl.current}
        placement="bottom-start">
        <ClickAwayListener onClickAway={closePopper}>
          <Box
            marginLeft={`${
              props.size === "small"
                ? FILTER_HEIGHT_SM / 2
                : FILTER_HEIGHT_PX / 2
            }px`}>
            <Paper elevation={1}>
              <AppList>
                <AppListItem
                  body={
                    <AppNumberCounter
                      min={1}
                      label={props.label}
                      count={props.value}
                      onUpdateCount={(val) => {
                        props.setValue(val)
                      }}
                    />
                  }
                />
              </AppList>
            </Paper>
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    display: "flex",
    width: "100%",
    height: (props: RetreatDetailsFilterProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM : FILTER_HEIGHT_PX,
    borderRadius: (props: RetreatDetailsFilterProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM / 2 : FILTER_HEIGHT_PX / 2,
  },
  updateButton: {
    height: "100%",
    borderRadius: (props: RetreatDetailsFilterProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM / 2 : FILTER_HEIGHT_PX / 2,
  },
}))

type RetreatDetailsFilterProps = {
  guests: number
  nights?: number
  onUpdate: (guests: number, nights?: number) => void
  size?: "large" | "small"
}

export default function RetreatDetailsFilter(props: RetreatDetailsFilterProps) {
  const classes = useStyles(props)
  let [guests, setGuests] = useState(props.guests)
  let [nights, setNights] = useState(props.nights)

  useEffect(() => {
    setNights(props.nights)
  }, [props.nights, setNights])
  useEffect(() => {
    setGuests(props.guests)
  }, [props.guests, setGuests])

  return (
    <Paper className={classes.root} variant="outlined">
      <Box flex={nights !== undefined ? 2 : 1} display="flex">
        <RetreatDetailsFilterItem
          title="Guests"
          value={guests}
          label="people"
          setValue={setGuests}
          size={props.size}
        />
        {nights !== undefined ? (
          <>
            <Box height="100%" display="flex" alignItems="center">
              <Box marginLeft={1} marginRight={1} height="80%">
                <Divider orientation="vertical" />
              </Box>
            </Box>
            <RetreatDetailsFilterItem
              title="Nights"
              value={nights}
              label="nights"
              setValue={setNights}
              size={props.size}
            />
          </>
        ) : undefined}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flex={props.size === "small" ? undefined : 1}
        padding={"4px"}>
        <AppButton
          className={classes.updateButton}
          color="primary"
          variant="contained"
          onClick={() => {
            if (guests !== props.guests || nights !== props.nights) {
              props.onUpdate(guests, nights)
            }
          }}
          disabled={props.guests === guests && props.nights === nights}>
          <Typography variant={props.size === "small" ? "caption" : "body1"}>
            Update
          </Typography>
        </AppButton>
      </Box>
    </Paper>
  )
}
