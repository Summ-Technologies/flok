import {Box, Typography, TypographyProps} from "@material-ui/core"

interface AppTypographyProps extends TypographyProps {
  bold?: boolean
  italic?: boolean
}

export default function AppTypography(props: AppTypographyProps) {
  let {bold, italic, children, ...otherProps} = props
  if (bold || italic) {
    children = (
      <Box
        component="span"
        fontWeight={bold ? "fontWeightMedium" : undefined}
        fontStyle={italic ? "italic" : undefined}>
        {children}
      </Box>
    )
  }

  return <Typography {...otherProps}>{children}</Typography>
}
