import {Button, makeStyles} from "@material-ui/core"
import {Rating} from "@material-ui/lab"
import React from "react"
import AppBaseCard from "../base/AppBaseCard"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  cardBody: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(0.25),
  },
  subtitle: {
    marginBottom: theme.spacing(0.25),
    textTransform: "uppercase",
  },
  row: {
    marginBottom: theme.spacing(0.25),
    display: "flex",
  },
  budgetIconFilled: {
    color: theme.palette.text.primary,
  },
  rooms: {
    textTransform: "uppercase",
  },
  description: {
    height: `${0.875 * 1.2 * 4}rem`, // is theme.typography.body2.lineHeight or body2.fontSize changes adjust this line
    overflow: "hidden",
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 4,
  },
}))

type AppHotelCardProps = {
  img: string
  name: string
  destination: string
  rooms: number
  stars: number
  budget: 1 | 2 | 3 | 4
  description: string
  selected?: boolean
  onSelect: () => void
  onExplore: () => void
}
export default function AppHotelCard(props: AppHotelCardProps) {
  let classes = useStyles(props)
  return (
    <AppBaseCard
      img={props.img}
      body={
        <div className={classes.cardBody}>
          <AppTypography noWrap className={classes.title} variant="h4">
            {props.name ? props.name : "\u00A0"}
          </AppTypography>
          <AppTypography
            noWrap
            className={classes.subtitle}
            variant="body2"
            color="textSecondary">
            {props.destination ? props.destination : "\u00A0"}
          </AppTypography>
          <Rating value={props.stars} readOnly size="small" />
          <div className={classes.row}>
            <Rating
              classes={{iconFilled: classes.budgetIconFilled}}
              readOnly
              value={props.budget}
              max={4}
              getLabelText={(value: number) =>
                `${new Array(value)
                  .fill(0)
                  .map(() => "$")
                  .join("")}`
              }
              icon={<AppTypography variant="body2">$</AppTypography>}
            />
            <AppTypography className={classes.rooms} variant="body2">
              {"\u00A0\u2022\u00A0"}
              {props.rooms} rooms
            </AppTypography>
          </div>
          <AppTypography
            className={classes.description}
            variant="body2"
            color="textSecondary">
            {props.description}
          </AppTypography>
        </div>
      }
      cta={
        <Button
          variant={props.selected ? "contained" : "outlined"}
          color="primary"
          fullWidth
          onClick={props.onSelect}>
          {props.selected ? "Selected" : "Select"}
        </Button>
      }
      onExplore={props.onExplore}
    />
  )
}
