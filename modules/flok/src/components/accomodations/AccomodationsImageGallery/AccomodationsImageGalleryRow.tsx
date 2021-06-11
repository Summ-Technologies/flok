import {Box} from "@material-ui/core"
import AppImage from "../../base/AppImage"

type SingleImageRowProps = {
  img: string
  alt: string
}

export function SingleImageRow(props: SingleImageRowProps) {
  return (
    <Box display="flex">
      <AppImage alt={props.alt} img={props.img} />
    </Box>
  )
}

type DoubleImageRowProps = {
  img1: {
    img: string
    alt: string
  }
  img2: {
    img: string
    alt: string
  }
}

export function DoubleImageRow(props: DoubleImageRowProps) {
  return (
    <Box display="flex">
      <AppImage alt={props.img1.alt} img={props.img1.img} />
      <AppImage alt={props.img2.alt} img={props.img2.img} />
    </Box>
  )
}

type TripleImageRowProps = {
  portrait: {
    img: string
    alt: string
  }
  landscape1: {
    img: string
    alt: string
  }
  landscape2: {
    img: string
    alt: string
  }
}

export function TripleImageRow(props: TripleImageRowProps) {
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" height="100%">
        <AppImage alt={props.landscape1.alt} img={props.landscape1.img} />
        <AppImage alt={props.landscape2.alt} img={props.landscape2.img} />
      </Box>
      <AppImage
        alt={props.portrait.alt}
        img={props.portrait.img}
        height="100%"
      />
    </Box>
  )
}
