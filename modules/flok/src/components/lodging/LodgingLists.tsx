import {Chip, makeStyles, Paper} from "@material-ui/core"
import {CheckCircle} from "@material-ui/icons"
import React, {PropsWithChildren, useEffect, useRef} from "react"
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

let useDestinationListItemStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[4],
    },
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    "& > *:not(:first-child)": {
      marginBottom: theme.spacing(1),
    },
  },
  imgContainer: {
    height: 100,
    width: 150,
    "& img": {
      objectFit: "cover",
      verticalAlign: "center",
      height: "100%",
      width: "100%",
    },
  },
  headerContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: theme.spacing(1),
    width: 200,
  },
  tagsContainer: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(0.5),
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
  budgetColumn: {width: 80},
  roomsColumn: {
    width: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  airportColumn: {
    width: 140,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    <Paper className={classes.root} onClick={props.onSelect}>
      <div className={classes.imgContainer}>
        <img src={props.img} alt={`${props.name} spotlight`} />
      </div>
      <div className={classes.headerContainer}>
        <AppTypography variant="body2" color="textSecondary">
          {props.subheader ? props.subheader : "\u00A0"}
        </AppTypography>
        <AppTypography variant="h4">
          {props.name ? props.name : "\u00A0"}
        </AppTypography>
      </div>
      <div className={classes.tagsContainer}>
        {props.tags.map((label) => (
          <Chip label={label} />
        ))}
      </div>
      {props.selected && (
        <div className={classes.checkContainer}>
          <CheckCircle color="primary" />
        </div>
      )}
    </Paper>
  )
}

type AppHotelListItemProps = {
  selected?: boolean
  onSelect: () => void
  img: string
  name: string
  subheader: string
  airportDistance: number
  budget: string
  numRooms: number
  tags: string[]
}
export function AppHotelListItem(props: AppHotelListItemProps) {
  let classes = useDestinationListItemStyles(props)
  let airportHours = Math.floor(props.airportDistance / 60)
  let airportMins = props.airportDistance % 60
  let airportTime =
    airportHours &&
    `${airportHours} hr${airportHours > 1 ? "s " : " "} ${airportMins} mins`
  return (
    <Paper className={classes.root} onClick={props.onSelect}>
      <div className={classes.imgContainer}>
        <img src={props.img} alt={`${props.name} spotlight`} />
      </div>
      <div className={classes.headerContainer}>
        <AppTypography variant="body2" color="textSecondary">
          {props.subheader ? props.subheader : "\u00A0"}
        </AppTypography>
        <AppTypography variant="h4">
          {props.name ? props.name : "\u00A0"}
        </AppTypography>
      </div>
      <div className={classes.budgetColumn}>
        <AppTypography variant="body1">{props.budget}</AppTypography>
      </div>
      <div className={classes.roomsColumn}>
        <AppTypography variant="body2" noWrap>
          Num rooms
        </AppTypography>
        <AppTypography variant="body1">{props.numRooms}</AppTypography>
      </div>
      <div className={classes.airportColumn}>
        <AppTypography variant="body2" noWrap>
          Distance to airport
        </AppTypography>
        <AppTypography variant="body1">{airportTime}</AppTypography>
      </div>
      <div className={classes.tagsContainer}>
        {props.tags.map((label) => (
          <Chip label={label} />
        ))}
      </div>
      {props.selected && (
        <div className={classes.checkContainer}>
          <CheckCircle color="primary" />
        </div>
      )}
    </Paper>
  )
}
