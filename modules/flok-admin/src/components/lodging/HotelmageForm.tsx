import {
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core"
import {Add, Delete} from "@material-ui/icons"
import {useFormik} from "formik"
import _ from "lodash"
import {useState} from "react"
import {
  AdminHotelDetailsModel,
  AdminImageOrientationOptions,
  AdminImageTagOptions,
  AdminImageUpdateModel,
} from "../../models/index"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: -theme.spacing(2),
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      padding: theme.spacing(2),
    },
  },
  formGroup: {
    overflowY: "scroll",
    display: "flex",
    width: "100%",
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
    maxHeight: 625,
  },
  imgRow: {
    display: "flex",
    width: "100%",
    "& > *": {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  imgPreview: {
    width: "20%",
    marginRight: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      opacity: "50%",
    },
  },
  spotlight: {
    display: "flex",
    flexDirection: "column",
    "& > :last-child": {
      width: 36,
    },
  },
}))

export type HotelImageFormType = {hotel: AdminHotelDetailsModel}

export default function HotelImageForm(props: HotelImageFormType) {
  let classes = useStyles(props)

  let formik = useFormik({
    initialValues: {
      newImages: [
        {
          id: -1,
          image_url: "",
          alt: "",
          orientation: AdminImageOrientationOptions[0],
          tag: AdminImageTagOptions[0],
          spotlight: false,
        },
      ] as AdminImageUpdateModel[],
      existingImages: (props.hotel.spotlight_img
        ? [{...props.hotel.spotlight_img, spotlight: true}]
        : []
      ).concat(
        props.hotel.imgs.map((img) => ({
          ...img,
          spotlight: false,
        }))
      ) as AdminImageUpdateModel[],
    },
    onSubmit: (values) => {},
  })

  let [modalImgIdx, setModalImgIdx] = useState(-1)

  const addImage = () => {
    formik.setFieldValue(
      "newImages",
      formik.values.newImages.concat({
        id: -1,
        image_url: "",
        alt: "",
        orientation: AdminImageOrientationOptions[0],
        tag: AdminImageTagOptions[0],
        spotlight: false,
      })
    )
  }

  const removeImage = (idx: number, existing: boolean) => {
    if (existing) {
      formik.setFieldValue(
        "existingImages",
        formik.values.existingImages
          .slice(0, idx)
          .concat(formik.values.existingImages.slice(idx + 1))
      )
    } else {
      formik.setFieldValue(
        "newImages",
        formik.values.newImages
          .slice(0, idx)
          .concat(formik.values.newImages.slice(idx + 1))
      )
    }
  }

  const updateSpotlight = (
    idx: number,
    existing: boolean,
    checked: boolean
  ) => {
    const existingImages = formik.values.existingImages.map((o) => ({
      ...o,
      spotlight: false,
    }))
    const newImages = formik.values.newImages.map((o) => ({
      ...o,
      spotlight: false,
    }))

    if (existing && checked) {
      existingImages[idx].spotlight = true
    } else if (checked) {
      newImages[idx].spotlight = false
    }

    formik.setFieldValue("newImages", newImages)
    formik.setFieldValue("existingImages", existingImages)
  }

  const textFieldProps = {
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
    fullWidth: true,
  }

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Existing Images</AppTypography>
        {formik.values.existingImages.map((img, i) => (
          <div className={classes.imgRow}>
            <img
              src={img.image_url}
              alt={img.alt}
              className={classes.imgPreview}
              onClick={() => setModalImgIdx(i)}
            />
            <Dialog
              open={modalImgIdx === i}
              onClose={() => setModalImgIdx(-1)}
              maxWidth="lg">
              <img src={img.image_url} alt={img.alt} />
            </Dialog>
            <div>
              <TextField
                id={`existingImages.${i}.alt`}
                value={formik.values.existingImages[i].alt}
                label="Alt Text"
                {...textFieldProps}
              />
              <TextField
                id={`existingImages.${i}.orientation`}
                value={formik.values.existingImages[i].orientation}
                select
                SelectProps={{native: true}}
                {...textFieldProps}
                label="Orientation">
                {AdminImageOrientationOptions.map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </TextField>
              <TextField
                id={`existingImages.${i}.tag`}
                value={formik.values.existingImages[i].tag}
                select
                SelectProps={{native: true}}
                {...textFieldProps}
                label="Tag">
                {AdminImageTagOptions.map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </TextField>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "flex-end",
                }}>
                <div className={classes.spotlight}>
                  <AppTypography>Spotlight Image?</AppTypography>
                  <Checkbox
                    onClick={() =>
                      updateSpotlight(
                        i,
                        true,
                        !formik.values.existingImages[i].spotlight
                      )
                    }
                    id={`existingImages.${i}.spotlight`}
                    value={formik.values.existingImages[i].spotlight}
                    checked={formik.values.existingImages[i].spotlight}
                  />
                </div>
                <IconButton onClick={() => removeImage(i, true)}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">New Images</AppTypography>
        {formik.values.newImages.map((img, i) => (
          <div className={classes.imgRow}>
            <div>
              <TextField
                id={`newImages.${i}.image_url`}
                value={formik.values.newImages[i].image_url}
                label="Image URL"
                {...textFieldProps}
                required
              />
              <TextField
                id={`newImages.${i}.alt`}
                value={formik.values.newImages[i].alt}
                label="Alt Text"
                {...textFieldProps}
              />
              <TextField
                id={`newImages.${i}.orientation`}
                value={formik.values.newImages[i].orientation}
                select
                SelectProps={{native: true}}
                {...textFieldProps}
                label="Orientation">
                {AdminImageOrientationOptions.map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </TextField>
              <TextField
                id={`newImages.${i}.tag`}
                value={formik.values.newImages[i].tag}
                select
                SelectProps={{native: true}}
                {...textFieldProps}
                label="Tag">
                {AdminImageTagOptions.map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </TextField>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "flex-end",
                }}>
                <div className={classes.spotlight}>
                  <AppTypography>Spotlight Image?</AppTypography>
                  <Checkbox
                    onClick={() =>
                      updateSpotlight(
                        i,
                        false,
                        !formik.values.existingImages[i].spotlight
                      )
                    }
                    id={`newImages.${i}.spotlight`}
                    value={formik.values.newImages[i].spotlight}
                    checked={formik.values.newImages[i].spotlight}
                  />
                </div>
                <IconButton onClick={() => removeImage(i, false)}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
        <div style={{margin: "0 auto"}}>
          <IconButton onClick={addImage}>
            <Add />
          </IconButton>
        </div>
      </Paper>
      <Box display="flex" flexDirection="row-reverse" width="100%">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={_.isEqual(formik.values, formik.initialValues)}>
          Save Changes
        </Button>
      </Box>
    </form>
  )
}
