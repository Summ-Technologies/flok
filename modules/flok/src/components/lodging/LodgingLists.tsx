import {
  ButtonBase,
  Checkbox,
  Chip,
  makeStyles,
  Paper,
  useMediaQuery,
} from "@material-ui/core"
import {ArrowRight} from "@material-ui/icons"
import clsx from "clsx"
import React, {PropsWithChildren, useEffect, useRef} from "react"
import {FlokTheme} from "../../theme"
import {HotelUtils} from "../../utils/lodgingUtils"
import AppTypography from "../base/AppTypography"

let useLodgingListStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type AppLodgingListProps = PropsWithChildren<{onReachEnd?: () => void}>
export function AppLodgingList(props: AppLodgingListProps) {
  let classes = useLodgingListStyles(props)
  const {onReachEnd} = props
  let sentinelRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    function loadMore(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onReachEnd && onReachEnd()
        }
      })
    }
    if (onReachEnd) {
      let observer = new IntersectionObserver(loadMore)
      if (sentinelRef.current) {
        observer.observe(sentinelRef.current)
      }
      return () => observer.disconnect()
    }
  }, [onReachEnd])
  return (
    <div className={classes.root}>
      {props.children}
      {props.onReachEnd && <li ref={sentinelRef} />}
    </div>
  )
}

let useListItemStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[4],
    },
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    maxWidth: "100%",
    border: (props: LodgingListItemProps) =>
      props.selected ? `solid 1px ${theme.palette.primary.main}` : "",
    boxShadow: (props: LodgingListItemProps) =>
      props.selected ? theme.shadows[2] : "",
  },
  checkbox: {
    position: "absolute",
    zIndex: 100,
    top: theme.spacing(2),
    left: theme.spacing(2),
    height: 16,
    width: 16,
    padding: 0,
  },
  checkboxIcon: {
    height: 16,
    width: 16,
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, .5)",
    borderColor: "rgba(255, 255, 255, .8)",
    borderStyle: "solid",
    borderRadius: 3,
  },
  checkboxCheckedIcon: {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.common.white,
    outlineColor: theme.palette.primary.main,
    outlineWidth: 1,
    outlineStyle: "solid",
  },
  exploreArrow: {
    width: 40, // edit children max width if changing this value
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    marginLeft: "auto",
  },
}))

type LodgingListItemProps = PropsWithChildren<{
  selected?: boolean
  onSelect: () => void
  onExplore?: () => void
}>

function LodgingListItem(props: LodgingListItemProps) {
  let classes = useListItemStyles(props)
  return (
    <Paper className={classes.root} onClick={props.onSelect}>
      <Checkbox
        disableRipple
        size="small"
        icon={<span className={classes.checkboxIcon} />}
        checkedIcon={
          <span
            className={clsx(classes.checkboxIcon, classes.checkboxCheckedIcon)}
          />
        }
        checked={props.selected === true}
        className={classes.checkbox}
      />
      {props.children}
      {props.onExplore && (
        <ButtonBase
          className={classes.exploreArrow}
          onClick={(e) => {
            e.stopPropagation()
            if (props.onExplore) props.onExplore()
          }}>
          <ArrowRight fontSize="large" />
        </ButtonBase>
      )}
    </Paper>
  )
}

let useDestinationListItemStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  imgContainer: {
    height: 100,
    width: 133,
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& img": {
      borderRadius: theme.shape.borderRadius,
      objectFit: "cover",
      verticalAlign: "center",
      height: "100%",
      width: "100%",
    },
  },
  body: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
    "& > *:not(:first-child):not($tagsContainer)": {
      marginTop: theme.spacing(1),
    },
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: 200,
  },
  tagsContainer: {
    display: "flex",
    marginTop: "auto",
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  checkContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
}))

type AppDestinationListItemProps = {
  selected?: boolean
  onSelect: () => void
  img: string
  name: string
  subheader: string
  tags: string[]
}
export function AppDestinationListItem(props: AppDestinationListItemProps) {
  let classes = useDestinationListItemStyles(props)
  return (
    <LodgingListItem selected={props.selected} onSelect={props.onSelect}>
      <div className={classes.root}>
        <div className={classes.imgContainer}>
          <img src={props.img} alt={`${props.name} spotlight`} />
        </div>
        <div className={classes.body}>
          <div className={classes.headerContainer}>
            <AppTypography variant="body2" color="textSecondary" uppercase>
              {props.subheader ? props.subheader : "\u00A0"}
            </AppTypography>
            <AppTypography variant="h4" noWrap>
              {props.name ? props.name : "\u00A0"}
            </AppTypography>
          </div>
          <div className={classes.tagsContainer}>
            {props.tags.map((label) => (
              <Chip size="small" label={label} />
            ))}
          </div>
        </div>
      </div>
    </LodgingListItem>
  )
}

let useHotelListItemStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imgContainer: {
    position: "relative",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    height: 150,
    width: 220,
    [theme.breakpoints.down("xs")]: {
      height: 100,
      width: 133,
    },
    "& img": {
      borderRadius: theme.shape.borderRadius,
      objectFit: "cover",
      verticalAlign: "center",
      height: "100%",
      width: "100%",
    },
  },
  flokRecommendedTag: {
    position: "absolute",
    borderRadius: 4,
    top: theme.spacing(0.75),
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  body: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
    "& > *:not(:first-child):not($tagsContainer)": {
      marginTop: theme.spacing(1),
    },
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 200,
    [theme.breakpoints.down("xs")]: {
      maxWidth: 140,
    },
  },
  attributesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-0.5),
    marginBottom: theme.spacing(0.5),
    "& > *": {
      marginBottom: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    },
  },
  attributeTag: {
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: theme.palette.grey[300], // matching chip default background color
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-0.5),
    "& > *": {
      marginLeft: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  },
}))

type AppHotelListItemProps = {
  selected?: boolean
  onSelect: () => void
  onExplore: () => void
  img: string
  name: string
  subheader: string
  airportDistance?: number
  budget: string
  numRooms: number
  tags: string[]
  recommended?: boolean
}
export function AppHotelListItem(props: AppHotelListItemProps) {
  let classes = useHotelListItemStyles(props)

  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  return (
    <LodgingListItem
      selected={props.selected}
      onSelect={props.onSelect}
      onExplore={props.onExplore}>
      <div className={classes.root}>
        <div className={classes.imgContainer}>
          {props.recommended ? (
            <AppTypography
              variant="caption"
              className={classes.flokRecommendedTag}>
              Flok {isSmallScreen ? "🤍" : "Recommended"}
            </AppTypography>
          ) : undefined}
          <img src={props.img} alt={`${props.name} spotlight`} />
        </div>
        <div className={classes.body}>
          <div className={classes.headerContainer}>
            <AppTypography
              variant="body2"
              color="textSecondary"
              uppercase
              noWrap>
              {props.subheader ? props.subheader : "\u00A0"}
            </AppTypography>
            <AppTypography variant="h4" noWrap>
              {props.name ? props.name : "\u00A0"}
            </AppTypography>
          </div>
          <div className={classes.attributesContainer}>
            <div className={classes.attributeTag}>
              <AppTypography variant="body2" noWrap uppercase>
                Budget
              </AppTypography>
              <AppTypography variant="body1" fontWeight="bold">
                {props.budget}
              </AppTypography>
            </div>
            <div className={classes.attributeTag}>
              <AppTypography variant="body2" noWrap uppercase>
                Rooms
              </AppTypography>
              <AppTypography variant="body1" fontWeight="bold">
                {props.numRooms}
              </AppTypography>
            </div>
            {props.airportDistance ? (
              <div className={classes.attributeTag}>
                <AppTypography variant="body2" noWrap uppercase>
                  Airport distance
                </AppTypography>
                <AppTypography variant="body1" fontWeight="bold">
                  {HotelUtils.getAirportTravelTime(props.airportDistance)}
                </AppTypography>
              </div>
            ) : undefined}
          </div>
          <div className={classes.tagsContainer}>
            {props.tags.map((label) => (
              <Chip size="small" label={label} />
            ))}
          </div>
        </div>
      </div>
    </LodgingListItem>
  )
}
