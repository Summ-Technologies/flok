import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core"
import {HighlightOffRounded} from "@material-ui/icons"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import config, {IMAGE_SERVER_BASE_URL_KEY} from "../../config"
import {ImageModel} from "../../models"
import {enqueueSnackbar} from "../../notistack-lib/actions"
import {ApiAction} from "../../store/actions/api"
import {getPresetImages} from "../../store/actions/retreat"
import AppMoreInfoIcon from "../base/AppMoreInfoIcon"

let useImageStyles = makeStyles((theme) => ({
  uploadImageContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  loader: {
    height: 20,
  },
  imageUploadFlex: {display: "flex", alignItems: "center"},
}))
type UploadImageWithTemplateProps = {
  value: ImageModel | undefined
  handleChange: (image: ImageModel) => void
  id: string
  headerText: string
  tooltipText?: string
  handleClear?: () => void
}

export default function UploadImageWithTemplate(
  props: UploadImageWithTemplateProps
) {
  const [loading, setLoading] = useState(false)
  let dispatch = useDispatch()
  let [presetModalOpen, setPresetModalOpen] = useState(false)
  var splitFileName = function (str: string) {
    // @ts-ignore
    return str.split("\\").pop().split("/").pop()
  }
  let [presetImages, setPresetImages] = useState([])

  async function fetchPresetImages() {
    let response = (await dispatch(
      getPresetImages("BANNER")
    )) as unknown as ApiAction
    if (!response.error) {
      setPresetImages(
        response.payload.preset_images.map(
          (presetImage: any) => presetImage.image
        )
      )
    }
  }
  let rows: {img1: ImageModel; img2?: ImageModel}[] = []
  useEffect(() => {
    !presetImages[0] && fetchPresetImages()
  }, [presetImages])
  let classes = useImageStyles()
  for (let i = 0; i < presetImages.length; i += 2) {
    if (i < presetImages.length - 1) {
      rows.push({
        img1: presetImages[i],
        img2: presetImages[i + 1],
      })
    } else {
      rows.push({
        img1: presetImages[i],
      })
    }
  }
  function handleImageClick(image: ImageModel) {
    props.handleChange(image)
    setPresetModalOpen(false)
  }
  return (
    <div className={classes.uploadImageContainer}>
      <Dialog
        open={presetModalOpen}
        onClose={() => {
          setPresetModalOpen(false)
        }}>
        <DialogTitle>Choose Preset Image</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={row.img1.image_url}
                        style={{height: 150, width: 240}}
                        onClick={() => {
                          handleImageClick(row.img1)
                        }}></img>
                    </TableCell>
                    {row.img2 && (
                      <TableCell align="right">
                        <img
                          src={row.img2.image_url}
                          style={{height: 150, width: 240}}
                          onClick={() => {
                            row.img2 && handleImageClick(row.img2)
                          }}></img>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <div style={{display: "flex", alignItems: "center"}}>
        <Typography className={classes.header}>{props.headerText}</Typography>
        {props.tooltipText && (
          <AppMoreInfoIcon tooltipText={props.tooltipText} />
        )}
      </div>

      {loading ? (
        <CircularProgress size="20px" className={classes.loader} />
      ) : (
        <div className={classes.imageUploadFlex}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            component="label">
            Choose File
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              hidden
              onChange={(e) => {
                if (e.target && e.target.files && e.target.files[0]) {
                  let data = new FormData()
                  data.append("file", e.target.files[0])
                  setLoading(true)
                  fetch(`${config.get(IMAGE_SERVER_BASE_URL_KEY)}/api/images`, {
                    body: data,
                    method: "POST",
                    mode: "cors",
                  })
                    .then((res) => res.json())
                    .then((resdata) => {
                      props.handleChange(resdata.image)
                      setLoading(false)
                    })
                    .catch((error) => {
                      setLoading(false)
                      dispatch(
                        enqueueSnackbar({
                          message: "Oops, something went wrong",
                          options: {
                            variant: "error",
                          },
                        })
                      )
                    })
                }
              }}
            />
          </Button>
          <Typography style={{marginLeft: "4px", marginRight: "4px"}}>
            or
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setPresetModalOpen(true)
            }}>
            Choose Preset
          </Button>
          {props.handleClear && (
            <IconButton onClick={props.handleClear} style={{marginLeft: "4px"}}>
              <HighlightOffRounded />
            </IconButton>
          )}
        </div>
      )}
      <Typography
        style={{
          width: 160,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          marginTop: "4px",
          marginLeft: "8px",
        }}>
        {props.value?.image_url
          ? splitFileName(props.value?.image_url)
          : "No file chosen"}
      </Typography>
    </div>
  )
}
