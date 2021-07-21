import {Card, CardActionArea, CardContent, makeStyles} from "@material-ui/core"
import React from "react"
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
}))

type AppLodgingProposalCardProps = {
  header: string
  subheader: string
  href: string
  stars: 0 | 1 | 2 | 3 | 4 | 5
  ImgProps: AppImageProps // Should always be a 4/3 ratio image
}
export default function AppLodgingProposalCard(
  props: AppLodgingProposalCardProps
) {
  let classes = useStyles(props)
  return (
    <Card variant="elevation" elevation={1} className={classes.root}>
      <CardActionArea>
        <AppImage {...props.ImgProps} />
        <CardContent>
          <AppTypography variant="h5">{props.header}</AppTypography>
          <AppTypography variant="body1">{props.subheader}</AppTypography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
