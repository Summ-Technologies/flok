import {Chip, makeStyles, Paper, Theme} from "@material-ui/core"
import {CheckCircle} from "@material-ui/icons"
import clsx from "clsx"
import {useEffect, useState} from "react"
import {DestinationModel} from "../../models/lodging"
import AppTypography from "../base/AppTypography"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type DestinationsListProps = {
  destinations: DestinationModel[]
  isSelected: (destination: DestinationModel) => boolean
  onSelect: (destination: DestinationModel) => void
  onExplore: (destination: DestinationModel) => void
}

export default function DestinationsList(props: DestinationsListProps) {
  let classes = useStyles(props)
  function shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }
  let [tags, setTags] = useState<{[key: number]: string[]}>({})
  useEffect(() => {
    let copy = {...tags}
    props.destinations.forEach((dest) => {
      let _tags = shuffleArray([
        "✈️ Hub Airport",
        "💻 Abundant Coworking",
        "🏖️ Beach",
        "🐬 Exotic",
      ]).slice(Math.random() * 4)
      copy[dest.id] = _tags
    })
    setTags(copy)
  }, [props.destinations.length])

  return (
    <div className={classes.root}>
      {props.destinations.map((destination, index) => {
        let subtitle = destination.state
          ? `${destination.state}, ${destination.country_abbreviation}`
          : `${destination.country}`
        return (
          <DestinationListItem
            name={destination.location}
            location={subtitle}
            img={destination.spotlight_img.image_url}
            tags={tags[destination.id] ? tags[destination.id] : []}
            onSelect={() => props.onSelect(destination)}
            selected={props.isSelected(destination)}
            key={index}
          />
        )
      })}
    </div>
  )
}

const useItemStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: 100,
    display: "flex",
    overflow: "hidden",
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[4],
    },
  },
  selected: {
    "&:hover": {
      boxShadow: theme.shadows[3],
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
}))

type DestinationListItemProps = {
  name: string
  location: string
  img: string
  tags: string[]
  selected: boolean
  onSelect: () => void
}

function DestinationListItem(props: DestinationListItemProps) {
  let classes = useItemStyles(props)
  return (
    <Paper
      className={clsx(classes.root, props.selected && classes.selected)}
      elevation={1}
      onClick={props.onSelect}>
      <div className={classes.imgContainer}>
        <img src={props.img} alt="this is an alt" />
      </div>
      <div className={classes.headerContainer}>
        <AppTypography variant="body2" color="textSecondary">
          {props.location ? props.location : "\u00A0"}
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
