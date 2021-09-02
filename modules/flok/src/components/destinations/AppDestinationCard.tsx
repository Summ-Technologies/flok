import {Button, makeStyles} from "@material-ui/core"
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
  subtitle: {
    marginBottom: theme.spacing(0.25),
    textTransform: "uppercase",
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  description: {
    height: `${0.875 * 1.2 * 6}rem`, // is theme.typography.body2.lineHeight or body2.fontSize changes adjust this line
  },
}))

type AppDestinationCardProps = {
  title: string // city
  subtitle: string // state/country
  description: string
  img: string
  selected?: boolean
  onSelect: () => void
  onExplore: () => void
}
export default function AppDestinationCard(props: AppDestinationCardProps) {
  let classes = useStyles(props)
  return (
    <AppBaseCard
      img={props.img}
      body={
        <div className={classes.cardBody}>
          <AppTypography
            noWrap
            className={classes.subtitle}
            variant="body2"
            color="textSecondary">
            {props.subtitle ? props.subtitle : "\u00A0"}
          </AppTypography>
          <AppTypography noWrap className={classes.title} variant="h4">
            {props.title ? props.title : "\u00A0"}
          </AppTypography>
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
