import {
  Box,
  Button,
  makeStyles,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AdminHotelModel} from "../../models"
import {RootState} from "../../store"
import {getDestinations, getHotelsByDest} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"
import DestinationSelect from "./DestinationSelect"

let useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
}))

type HotelSearchModalProps = {
  submitText?: string
  onSubmit: (hotelId: number) => void
  onClose: () => void
}
export default function HotelSearchModal(props: HotelSearchModalProps) {
  let classes = useStyles()
  let dispatch = useDispatch()
  let destinationsList = useSelector(
    (state: RootState) => state.admin.allDestinations
  )
  let [selectedDestinationId, setSelectedDestinationId] = useState<
    number | undefined
  >(undefined)
  let hotelsByDestination = useSelector(
    (state: RootState) => state.admin.hotelsByDestination
  )
  let hotels = useSelector((state: RootState) => state.admin.hotels)
  let [selectedHotelId, setSelectedHotelId] = useState<number | undefined>(
    undefined
  )

  useEffect(() => {
    if (destinationsList == null) {
      dispatch(getDestinations())
    }
  }, [destinationsList, dispatch])

  useEffect(() => {
    if (selectedDestinationId != null) {
      let hotelIds = hotelsByDestination[selectedDestinationId]
      if (hotelIds == null) {
        dispatch(getHotelsByDest(selectedDestinationId))
      }
    }
  }, [selectedDestinationId, hotelsByDestination, dispatch])

  return (
    <Modal open onClose={props.onClose}>
      <Box
        maxWidth={400}
        minWidth={300}
        position="fixed"
        top="50%"
        left="50%"
        style={{
          transform: "translate(-50%, -50%)",
        }}>
        <Paper>
          <Box paddingY={4} paddingX={2} display="flex" flexDirection="column">
            <AppTypography variant="body1" fontWeight="bold" paragraph>
              Select Hotel
            </AppTypography>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                props.onSubmit(selectedHotelId!)
                props.onClose()
              }}
              className={classes.form}>
              <DestinationSelect
                value={selectedDestinationId}
                onChange={(e) => {
                  setSelectedDestinationId(parseInt(e.target.value))
                  setSelectedHotelId(undefined)
                }}
              />
              <TextField
                select
                SelectProps={{native: true}}
                fullWidth
                label="Hotels"
                placeholder="Select a hotel"
                InputLabelProps={{shrink: true}}
                value={selectedHotelId}
                onChange={(e) => {
                  setSelectedHotelId(parseInt(e.target.value))
                }}>
                {selectedHotelId == null && (
                  <option value={undefined}>Select a hotel</option>
                )}
                {selectedDestinationId != null &&
                  hotelsByDestination[selectedDestinationId] &&
                  hotelsByDestination[selectedDestinationId].map((id) => {
                    let hotel: AdminHotelModel = hotels[id]!
                    return <option value={hotel.id}>{hotel.name}</option>
                  })}
              </TextField>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  disabled={selectedHotelId == null}
                  type="submit"
                  color="primary"
                  variant="contained">
                  {props.submitText ? props.submitText : "Submit"}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Modal>
  )
}
