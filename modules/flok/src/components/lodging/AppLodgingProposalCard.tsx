import {
  Button,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  makeStyles,
} from "@material-ui/core"
import {MoreVert} from "@material-ui/icons"
import React from "react"
import {Link} from "react-router-dom"
import AppImage, {AppImageProps} from "../base/AppImage"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
    "& img": {
      borderRadius: 0,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    },
  },
  cardActionArea: {
    padding: theme.spacing(1),
  },
}))

type AppLodgingProposalCardProps = {
  header: string
  subheader: string
  stars: 0 | 1 | 2 | 3 | 4 | 5
  ImgProps: AppImageProps // Should always be a 4/3 ratio image
  href: string
}
export default function AppLodgingProposalCard(
  props: AppLodgingProposalCardProps
) {
  let classes = useStyles(props)
  return (
    <Card variant="elevation" elevation={1} className={classes.root}>
      <AppImage {...props.ImgProps} />
      <CardHeader
        disableTypography
        title={<AppTypography variant="h5">{props.header}</AppTypography>}
        subheader={
          <AppTypography variant="body1">{props.subheader}</AppTypography>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
      />
      <CardActions>
        <Button
          component={Link}
          to={props.href}
          fullWidth
          color="primary"
          variant="outlined">
          View proposal
        </Button>
      </CardActions>
    </Card>
  )
}
