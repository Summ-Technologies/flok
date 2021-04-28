import {
  Box,
  ButtonBase,
  ClickAwayListener,
  makeStyles,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {useEffect, useRef, useState} from "react"
import AppButton from "../base/AppButton"
import AppList, {AppListItem} from "../base/AppList"
import AppNumberCounter from "../base/AppNumberCounter"
import AppTypography from "../base/AppTypography"

const FILTER_HEIGHT_PX = 70
const FILTER_HEIGHT_SM = 50
const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    display: "flex",
    width: "100%",
    height: (props: RetreatDetailsFilterProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM : FILTER_HEIGHT_PX,
    borderRadius: (props: RetreatDetailsFilterProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM / 2 : FILTER_HEIGHT_PX / 2,
  },
  filters: {
    "& > *:not(:first-child)": {
      "& > $filterButtonBody": {},
    },
  },
  filterButtonFocused: {},
  filterButtonBody: {},
  filterButton: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    borderRadius: (props: RetreatDetailsFilterProps) =>
      props.size === "small" ? FILTER_HEIGHT_SM / 2 : FILTER_HEIGHT_PX / 2,
    height: "100%",
    "&:hover, &$filterButtonFocused, &.active": {
      boxShadow: theme.shadows[2],
      "& > $filterButtonBody": {
        borderLeft: "none",
      },
    },
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
  setGuests: (val: number) => void
  setNights?: (val: number) => void
  size?: "large" | "small"
}

export default function RetreatDetailsFilter(props: RetreatDetailsFilterProps) {
  const classes = useStyles(props)
  let [guests, setGuests] = useState(() => props.guests)
  let [nights, setNights] = useState(() => props.nights)
  let guestsRef = useRef(null)
  let nightsRef = useRef(null)

  useEffect(() => {
    setNights(props.nights)
  }, [props.nights, setNights])
  useEffect(() => {
    setGuests(props.guests)
  }, [props.guests, setGuests])

  type RetreatDetailsFilterItemProps = {
    title: string
    label: string
    value: number
    setValue: (newVal: number) => void
    anchorEl: React.MutableRefObject<any>
    size?: "large" | "small"
  }
  function RetreatDetailsFilterItem(props: RetreatDetailsFilterItemProps) {
    let [open, setOpen] = useState(false)
    const openPopper = (event: React.MouseEvent<HTMLElement>) => {
      setOpen(true)
    }
    const closePopper = () => {
      setOpen(false)
    }
    return (
      <>
        <ButtonBase
          aria-describedby={open ? "simple-popper" : undefined}
          ref={props.anchorEl}
          className={clsx(classes.filterButton, open ? "active" : undefined)}
          focusVisibleClassName={classes.filterButtonFocused}
          onClick={openPopper}>
          <Box
            className={classes.filterButtonBody}
            display="flex"
            flexDirection="column"
            textAlign="left"
            paddingLeft={`${
              props.size === "small"
                ? FILTER_HEIGHT_SM / 2
                : FILTER_HEIGHT_PX / 2
            }px`}>
            <AppTypography
              bold
              variant={props.size === "small" ? "caption" : "body1"}>
              {props.title}
            </AppTypography>
            <AppTypography
              variant={props.size === "small" ? "caption" : "body1"}>
              {props.value} {props.label}
            </AppTypography>
          </Box>
        </ButtonBase>
        <Popper
          id={open ? "simple-popper" : undefined}
          open={open}
          anchorEl={props.anchorEl.current}
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
                        count={props.value}
                        onUpdateCount={props.setValue}
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
  return (
    <Paper className={classes.root} variant="outlined">
      <Box
        flex={nights !== undefined ? 2 : 1}
        display="flex"
        className={classes.filters}>
        <RetreatDetailsFilterItem
          title="Guests"
          value={guests}
          label="people"
          setValue={setGuests}
          anchorEl={guestsRef}
          size={props.size}
        />
        {nights !== undefined ? (
          <RetreatDetailsFilterItem
            title="Nights"
            value={nights}
            label="nights"
            setValue={setNights}
            anchorEl={nightsRef}
            size={props.size}
          />
        ) : undefined}
      </Box>
      <Box display="flex" flexDirection="column" flex={1} padding={"4px"}>
        <AppButton
          className={classes.updateButton}
          color="primary"
          variant="contained"
          disabled={props.guests === guests && props.nights === nights}>
          <Typography variant="body2">Update</Typography>
        </AppButton>
      </Box>
    </Paper>
  )
}
