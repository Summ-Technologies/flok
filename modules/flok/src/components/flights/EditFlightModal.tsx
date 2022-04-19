import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import {ArrowForward} from "@material-ui/icons"
import {useFormik} from "formik"
import _ from "lodash"
import {useEffect, useRef, useState} from "react"
import {useDispatch} from "react-redux"
import {RetreatTripLeg} from "../../models/retreat"
import {patchTrip} from "../../store/actions/retreat"
import FlightCard from "./FlightCard"

function EditFlightModal(props: any) {
  let {open, setOpen, type, flights} = props
  function handleClose() {
    setOpen(false)
  }

  let useStyles = makeStyles((theme) => ({
    line: {
      border: "2px solid black",
      margin: theme.spacing(1),
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
    cardLine: {
      display: "flex",
    },
    editButton: {
      height: "35px",
      top: "10px",
    },
    tripLegRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      "& > *": {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
      },
    },
    tripLeg: {
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: theme.palette.primary.light,
      paddingBottom: theme.spacing(2),
    },
    trashDiv: {
      textAlign: "right",
    },
  }))
  let classes = useStyles()
  let dispatch = useDispatch()
  const [selectedFlight, setSelectedFlight] = useState(100)
  const [flightsState, setFlightsState] = useState(flights?.trip_legs)
  let initialFlightsState = flights?.trip_legs

  useEffect(() => {
    flights && setFlightsState(flights.trip_legs)
  }, [flights])

  useEffect(() => {
    initialFlightsState = flights?.trip_legs
  }, [flights?.trip_legs])

  function handleCancel() {
    setFlightsState(initialFlightsState)
    setSelectedFlight(100)
    handleClose()
  }
  function handleAdd() {
    setFlightsState((flightsState: any) => {
      return [
        ...flightsState,
        {
          airline: "",
          dep_airport: "",
          arr_airport: "",
          flight_num: "",
          dep_datetime: "",
          arr_datetime: "",
          duration: "",
        },
      ]
    })
    formik.setFieldValue(`trip_legs`, [
      ...formik.values.trip_legs,
      {
        airline: "",
        dep_airport: "",
        arr_airport: "",
        flight_num: "",
        dep_datetime: "",
        arr_datetime: "",
        duration: "",
      },
    ])
    setSelectedFlight(flightsState.length)
  }
  const formRef = useRef()
  const anchorEl = useRef<HTMLFormElement>(null)
  // useLayoutEffect(() => {
  //   console.log(anchorEl)
  // })

  let formik = useFormik({
    initialValues: {
      trip_legs: flightsState,
    },
    onSubmit: (values: any) => {
      dispatch(patchTrip(flights.id, formik.values))
      setFlightsState((flightsState: any) =>
        flightsState.filter(
          (leg: any) =>
            !_.isEqual(leg, {
              dep_airport: "",
              arr_airport: "",
              dep_datetime: "",
              arr_datetime: "",
              flight_num: "",
              airline: "",
            })
        )
      )
    },
    enableReinitialize: true,
  })
  const textFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {type} Flights </DialogTitle>
      <DialogContent>
        {flightsState?.map((leg: RetreatTripLeg, i: number) => {
          if (i === selectedFlight) {
            return (
              <>
                <hr className={classes.line}></hr>
                {/* Bug must be fixed below */}
                {/* {flightsState && (
                  <EditFlightForm
                    flightsState={flightsState}
                    setFlightsState={setFlightsState}
                    flightIdx={selectedFlight}
                    setSelectedFlight={setSelectedFlight}
                  />
                )} */}

                <form ref={anchorEl} onSubmit={formik.handleSubmit}>
                  <div className={classes.tripLegRow}>
                    <TextField
                      {...textFieldProps}
                      id={`trip_legs.${i}.dep_airport`}
                      value={formik.values.trip_legs[i].dep_airport}
                      label="Departing Airport"
                    />
                    <ArrowForward />
                    <TextField
                      {...textFieldProps}
                      id={`trip_legs.${i}.arr_airport`}
                      value={formik.values.trip_legs[i].arr_airport}
                      label="Arriving Airport"
                    />
                  </div>
                  <div className={classes.tripLegRow}>
                    <TextField
                      {...textFieldProps}
                      type="datetime-local"
                      id={`trip_legs.${i}.dep_datetime`}
                      value={formik.values.trip_legs[i].dep_datetime}
                      helperText="Departing airport timezone"
                      label="Departing Date & Time"
                    />
                    <TextField
                      {...textFieldProps}
                      type="datetime-local"
                      id={`trip_legs.${i}.arr_datetime`}
                      value={formik.values.trip_legs[i].arr_datetime}
                      helperText="Arriving airport timezone"
                      label="Arriving Date & Time"
                    />
                  </div>
                  <div className={classes.tripLegRow}>
                    <TextField
                      {...textFieldProps}
                      id={`trip_legs.${i}.flight_num`}
                      value={formik.values.trip_legs[i].flight_num}
                      label="Flight #"
                    />
                    <TextField
                      {...textFieldProps}
                      id={`trip_legs.${i}.airline`}
                      value={formik.values.trip_legs[i].airline}
                      label="Airline"
                    />
                  </div>
                  {/* <div className={classes.trashDiv}>
                    <IconButton onClick={handleDelete}>
                      <Delete />
                    </IconButton>
                  </div> */}
                  <Button type="submit">Submit</Button>
                </form>

                <hr className={classes.line}></hr>
              </>
            )
          }
          return (
            <div className={classes.cardLine}>
              <FlightCard flight={leg} />
              <Button
                variant="contained"
                size="small"
                color="primary"
                className={classes.editButton}
                onClick={() => setSelectedFlight(i)}>
                Edit
              </Button>
            </div>
          )
        })}

        {!flightsState?.length && <Typography>No Flights Currently</Typography>}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button color="primary" onClick={handleAdd}>
          Add Flight
        </Button>
        <div>
          {" "}
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // dispatch(patchTrip(flights.id, {trip_legs: flightsState}))
              // setFlightsState((flightsState: any) =>
              //   flightsState.filter(
              //     (leg: any) =>
              //       !_.isEqual(leg, {
              //         dep_airport: "",
              //         arr_airport: "",
              //         dep_datetime: "",
              //         arr_datetime: "",
              //         flight_num: "",
              //         airline: "",
              //       })
              //   )
              // )

              setSelectedFlight(100)
              handleClose()
            }}
            color="primary">
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
export default EditFlightModal
