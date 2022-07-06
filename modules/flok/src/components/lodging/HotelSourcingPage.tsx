import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Link,
  makeStyles,
  Paper,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core"
import {Cancel, ExpandLess, ExpandMore} from "@material-ui/icons"
import {Autocomplete} from "@material-ui/lab"
import querystring from "querystring"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Link as ReactRouterLink} from "react-router-dom"
import {HotelModel} from "../../models/lodging"
import {PriceOption} from "../../models/retreat"
import LoadingPage from "../../pages/misc/LoadingPage"
import {useRetreat} from "../../pages/misc/RetreatProvider"
import {AppRoutes} from "../../Stack"
import {RootState} from "../../store"
import {ApiAction} from "../../store/actions/api"
import {getLodgingTags, getSampleHotels} from "../../store/actions/lodging"
import {useQuery, useQueryAsList} from "../../utils"
import {useDestinations} from "../../utils/lodgingUtils"
import AppTypography from "../base/AppTypography"
import PageBody from "../page/PageBody"
import PageHeader from "../page/PageHeader"
import HotelForRFPRow from "./HotelForRFPRow"

let useStyles = makeStyles((theme) => ({
  pageBody: {
    margin: theme.spacing(2),
  },
  RFPModal: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  RFPModalText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  RFPModalButton: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2),
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
  },
  filterOverviewText: {
    marginLeft: theme.spacing(2),
  },
  filterBody: {
    padding: theme.spacing(2),
  },
  filterBodyWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    overflow: "scroll",
  },
  filterLocations: {
    minWidth: 300,
    marginBottom: theme.spacing(4),
  },
  filterLocationsFilter: {
    marginLeft: theme.spacing(2),
  },
  sliderFiltersDiv: {
    display: "flex",
    gap: theme.spacing(12),
  },
  slider: {
    width: 300,
    marginTop: theme.spacing(4.5),
    marginLeft: theme.spacing(4.5),
    marginRight: theme.spacing(3),
  },
  priceRangeFilterWrapper: {
    display: "flex",
    marginTop: "8px",
    flexDirection: "column",
  },
  hotelTagsWrapper: {
    maxWidth: 300,
    overflow: "scroll",
    display: "flex",
    flexDirection: "column",
    maxHeight: 320,
  },
  RFPRowWrapper: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
}))

function HotelSourcingPage() {
  let classes = useStyles()
  const [hotels, setHotels] = useState<HotelModel[]>([])
  let [retreat, retreatIdx] = useRetreat()

  let [roomsMinQuery, setRoomsMinQuery] = useQuery("rooms-min")
  let [roomsMaxQuery, setRoomsMaxQuery] = useQuery("rooms-max")
  let [hotelTagsQuery, setHotelTagsQuery] = useQueryAsList("tags")
  let [maxDistanceFromAirportQuery, setMaxDistanceFromAirportQuery] = useQuery(
    "distance-from-airport"
  )
  let [priceRangeQuery, setPriceRangeQuery] = useQueryAsList("price")
  let [locationListQuery, setLocationListQuery] = useQueryAsList("location")

  // to pass as a next parameter
  let queryParams: {[param: string]: string | string[]} = {}
  if (roomsMaxQuery) {
    queryParams["rooms-max"] = roomsMaxQuery
  }
  if (roomsMinQuery) {
    queryParams["rooms-min"] = roomsMinQuery
  }
  if (hotelTagsQuery) {
    queryParams["tags"] = hotelTagsQuery
  }
  if (maxDistanceFromAirportQuery) {
    queryParams["distance-from-airport"] = maxDistanceFromAirportQuery
  }
  if (priceRangeQuery) {
    queryParams["price"] = priceRangeQuery
  }

  let dispatch = useDispatch()
  let [destinations, loadingDestinations] = useDestinations()
  let [loadingHotels, setLoadingHotels] = useState(false)
  let [showFilters, setShowFilters] = useState(false)

  let [minNumberOfRooms, setMinNumberOfRooms] = useState(
    roomsMinQuery ? parseInt(roomsMinQuery) : 0
  )
  let [maxNumberOfRooms, setMaxNumberOfRooms] = useState(
    roomsMaxQuery ? parseInt(roomsMaxQuery) : 1000
  )
  let [maxDistanceFromAirport, setMaxDistanceFromAirport] = useState(
    maxDistanceFromAirportQuery ? parseInt(maxDistanceFromAirportQuery) : 180
  )
  let lodgingTags = useSelector((state: RootState) => {
    return Object.values(state.lodging.lodgingTags)
  })
  let [selectedTags, setSelectedTags] = useState<{[id: number]: boolean}>({})
  let [priceRange, setPriceRange] = useState<{[price: string]: boolean}>({
    $: false,
    $$: false,
    $$$: false,
    $$$$: false,
  })

  let priceOptions = Object.keys(priceRange)

  let [fillRFPModalOpen, setFillRFPModalOpen] = useState(false)

  let selectedHotelsMap: {[hotelId: number]: boolean} = {}
  retreat.selected_hotels.forEach((selectedHotel) => {
    selectedHotelsMap[selectedHotel.hotel_id] = true
  })
  let [locationList, setLocationList] = useState<string[]>([])

  useEffect(() => {
    if (maxDistanceFromAirportQuery) {
      setMaxDistanceFromAirport(parseInt(maxDistanceFromAirportQuery))
    }
  }, [maxDistanceFromAirportQuery])
  useEffect(() => {
    if (roomsMaxQuery) {
      setMaxNumberOfRooms(parseInt(roomsMaxQuery))
    }
  }, [roomsMaxQuery])
  useEffect(() => {
    if (roomsMinQuery) {
      setMinNumberOfRooms(parseInt(roomsMinQuery))
    }
  }, [roomsMinQuery])

  useEffect(() => {
    if (locationListQuery) {
      setLocationList(locationListQuery)
    }
  }, [locationListQuery])

  useEffect(() => {
    if (priceRangeQuery) {
      let priceRangeMap = {
        $: false,
        $$: false,
        $$$: false,
        $$$$: false,
      }
      priceRangeQuery.forEach((price) => {
        priceRangeMap[price as PriceOption] = true
      })
      setPriceRange(priceRangeMap)
    }
  }, [priceRangeQuery])

  useEffect(() => {
    if (hotelTagsQuery) {
      let selectedTagsMap: {[id: string]: boolean} = {}
      hotelTagsQuery.forEach((hotelId) => {
        selectedTagsMap[hotelId] = true
      })
      setSelectedTags(selectedTagsMap)
    }
  }, [hotelTagsQuery])

  let [testValue, setTestValue] = useState("")

  async function getHotels() {
    setLoadingHotels(true)
    let response = (await dispatch(getSampleHotels())) as unknown as ApiAction
    if (!response.error) {
      setHotels(response.payload.hotels)
    }
    setLoadingHotels(false)
  }
  useEffect(() => {
    !hotels[0] && getHotels()
    !lodgingTags[0] && dispatch(getLodgingTags())
  }, [])
  const distanceFromAirportMarks = [
    {
      value: 15,
      label: "15 minutes",
    },
    {
      value: 60,
      label: "1 Hour",
    },
    {
      value: 120,
      label: "2 Hours",
    },
    {
      value: 180,
      label: "3 Hours+",
    },
  ]
  const roomNumberMarks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1000,
      label: "1000 +",
    },
  ]
  if (loadingHotels || loadingDestinations) {
    return <LoadingPage />
  }
  return (
    <PageBody appBar>
      <div className={classes.pageBody}>
        <PageHeader
          header={
            <AppTypography variant="h1" fontWeight="bold">
              Venue Sourcing
            </AppTypography>
          }
          subheader="Find the best venues for your company retreat"
        />
        <Dialog
          open={fillRFPModalOpen}
          onClose={() => {
            setFillRFPModalOpen(false)
          }}>
          <DialogContent className={classes.RFPModal}>
            <AppTypography fontWeight="bold" className={classes.RFPModalText}>
              You need to fill out an RFP so the hotel has all the information
              they need in order to create their proposal for you.
            </AppTypography>
            <Link
              className={classes.RFPModalButton}
              component={ReactRouterLink}
              variant="inherit"
              underline="none"
              color="inherit"
              to={
                AppRoutes.getPath("RFPFormPage", {
                  retreatIdx: retreatIdx.toString(),
                }) +
                "?next=" +
                encodeURIComponent(
                  AppRoutes.getPath("HotelSourcingPage", {
                    retreatIdx: retreatIdx.toString(),
                  }) +
                    (Object.keys(queryParams).length > 0
                      ? "?" + querystring.stringify(queryParams)
                      : "")
                )
              }>
              <Button variant="contained" color="primary">
                Fill out RFP
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
        <div>
          <div
            className={classes.filterBar}
            onClick={() => {
              setShowFilters((filters) => !filters)
            }}>
            <Typography>Filters</Typography>

            {showFilters ? <ExpandLess /> : <ExpandMore />}
            <Typography className={classes.filterOverviewText}>
              Rooms: {minNumberOfRooms} - {maxNumberOfRooms} | Max Distance from
              Airport: {maxDistanceFromAirport} min | Price Range:{" "}
              {Object.entries(priceRange)
                .filter((option) => option[1])
                .map((option) => option[0]).length > 0
                ? Object.entries(priceRange)
                    .filter((option) => option[1])
                    .map((option) => option[0])
                    .join(", ")
                : "Any"}{" "}
              |{" "}
              {
                Object.values(selectedTags).filter((tag) => {
                  return tag === true
                }).length
              }{" "}
              Tag
              {Object.values(selectedTags).filter((tag) => {
                return tag === true
              }).length === 1
                ? ""
                : "s"}{" "}
              Selected{" "}
              {locationList[0]
                ? locationList.length === 1
                  ? `| ${
                      destinations[parseInt(locationList[0].split(":")[0])]
                        .location
                    }`
                  : `| ${locationList.length} locations`
                : ""}
            </Typography>
          </div>
          {showFilters && (
            <Paper className={classes.filterBody}>
              <div className={classes.filterBodyWrapper}>
                <div>
                  <div className={classes.filterLocations}>
                    <Typography variant="h4">Locations</Typography>
                    <div className={classes.filterLocationsFilter}>
                      <Autocomplete
                        disableClearable
                        selectOnFocus
                        onInputChange={(e, value, reason) => {
                          if (reason === "reset") {
                            setTestValue("")
                          } else {
                            setTestValue(value)
                          }
                        }}
                        inputValue={testValue}
                        onChange={(e, value, reason) => {
                          if (
                            reason === "select-option" &&
                            value &&
                            locationListQuery
                              .map(
                                (locationString) => locationString.split(":")[0]
                              )
                              .indexOf(value.id.toString()) === -1
                          ) {
                            setLocationListQuery([
                              ...locationListQuery,
                              value.id.toString() + ":100",
                            ])
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Add location" />
                        )}
                        clearOnBlur
                        options={Object.values(destinations)}
                        getOptionLabel={(option) =>
                          option.location
                        }></Autocomplete>
                      {locationList.map((location, index) => {
                        let id = location.split(":")[0]
                        let distance = location.split(":")[1]
                        return (
                          <LocationItem
                            distance={parseInt(distance)}
                            onChangeDistance={(newDistance) => {
                              console.log(newDistance)
                              let locationListCopy = [...locationListQuery]
                              locationListCopy[index] = `${id}:${newDistance}`
                              setLocationListQuery([...locationListCopy])
                            }}
                            location={destinations[parseInt(id)].location}
                            onDelete={() => {
                              let locationsCopy = [...locationListQuery]
                              let locationsToIds = locationsCopy.map(
                                (location) => location.split(":")[0]
                              )
                              var index = locationsToIds.indexOf(id.toString())
                              if (index !== -1) {
                                locationsCopy.splice(index, 1)
                              }
                              setLocationListQuery([...locationsCopy])
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <div className={classes.sliderFiltersDiv}>
                    <div>
                      <Typography variant="h4">Number of Rooms</Typography>
                      <Slider
                        className={classes.slider}
                        step={100}
                        marks={roomNumberMarks}
                        min={0}
                        max={1000}
                        valueLabelDisplay="on"
                        value={[minNumberOfRooms, maxNumberOfRooms]}
                        onChange={(event, newValue: number | number[]) => {
                          let newValueArray = newValue as number[]
                          if (roomsMaxQuery !== newValueArray[1].toString()) {
                            setRoomsMaxQuery(newValueArray[1].toString())
                          }
                          if (roomsMinQuery !== newValueArray[0].toString()) {
                            setRoomsMinQuery(newValueArray[0].toString())
                          }
                        }}></Slider>
                      <Typography variant="h4">
                        Maximum Distance From the Airport
                      </Typography>
                      <Slider
                        className={classes.slider}
                        step={15}
                        marks={distanceFromAirportMarks}
                        min={15}
                        max={180}
                        valueLabelDisplay="on"
                        value={maxDistanceFromAirport}
                        onChange={(event, newValue: number | number[]) => {
                          setMaxDistanceFromAirportQuery(newValue.toString())
                        }}></Slider>
                    </div>

                    <div>
                      <Typography variant="h4">Price Range</Typography>

                      <div className={classes.priceRangeFilterWrapper}>
                        {priceOptions.map((option) => {
                          return (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    priceRange[
                                      option as unknown as keyof typeof priceRange
                                    ]
                                  }
                                  onChange={(e) => {
                                    if (
                                      !priceRange[
                                        option as unknown as keyof typeof priceRange
                                      ]
                                    ) {
                                      setPriceRangeQuery([
                                        ...priceRangeQuery,
                                        option,
                                      ])
                                    } else {
                                      let priceRangeQueryCopy = [
                                        ...priceRangeQuery,
                                      ]
                                      var index =
                                        priceRangeQueryCopy.indexOf(option)
                                      if (index !== -1) {
                                        priceRangeQueryCopy.splice(index, 1)
                                      }
                                      setPriceRangeQuery([
                                        ...priceRangeQueryCopy,
                                      ])
                                    }
                                  }}
                                  name={option}
                                  color="primary"
                                />
                              }
                              label={option}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes.hotelTagsWrapper}>
                  <Typography variant="h4">Hotel Tags</Typography>
                  {lodgingTags.map((tag) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedTags[tag.id]}
                            onChange={(e) => {
                              if (!selectedTags[tag.id]) {
                                setHotelTagsQuery([
                                  ...hotelTagsQuery,
                                  tag.id.toString(),
                                ])
                              } else {
                                let hotelTagsCopy = [...hotelTagsQuery]
                                var index = hotelTagsCopy.indexOf(
                                  tag.id.toString()
                                )
                                if (index !== -1) {
                                  hotelTagsCopy.splice(index, 1)
                                }
                                setHotelTagsQuery([...hotelTagsCopy])
                              }
                            }}
                            name={tag.name}
                            color="primary"
                          />
                        }
                        label={tag.name}
                      />
                    )
                  })}
                </div>
              </div>
            </Paper>
          )}
        </div>
        {hotels
          .filter((hotel) => {
            let maxRooms =
              maxNumberOfRooms === 1000 ? Infinity : maxNumberOfRooms
            let minRooms = minNumberOfRooms
            let distanceFromAirport =
              maxDistanceFromAirport === 180 ? Infinity : maxDistanceFromAirport
            let tagged = true
            for (let tag of Object.keys(selectedTags)) {
              let numberTag = parseInt(tag)
              if (
                selectedTags[numberTag] &&
                !hotel.lodging_tags_filter_dict[numberTag]
              ) {
                tagged = false
              }
            }
            let inPriceRange = true
            if (
              Object.entries(priceRange)
                .filter((option) => option[1])
                .map((option) => option[0]).length > 0
            ) {
              inPriceRange = priceRange[hotel.price as keyof typeof priceRange]
            }
            return (
              hotel.num_rooms &&
              hotel.num_rooms >= minRooms &&
              hotel.num_rooms <= maxRooms &&
              hotel.airport_travel_time &&
              hotel.airport_travel_time <= distanceFromAirport &&
              tagged &&
              inPriceRange
            )
          })
          .map((hotel) => {
            let destination = destinations[hotel.destination_id]
            if (destination) {
              return (
                <div className={classes.RFPRowWrapper}>
                  <HotelForRFPRow
                    setModalOpen={() => {
                      setFillRFPModalOpen(true)
                    }}
                    hotel={hotel}
                    destination={destination}
                    selected={selectedHotelsMap[hotel.id]}
                  />
                </div>
              )
            }
          })}
      </div>
    </PageBody>
  )
}
export default HotelSourcingPage

let useLocationItemStyles = makeStyles((theme) => ({
  locationItem: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
    gap: "8px",
  },
}))
type LocationItemProps = {
  location: string
  onDelete: () => void
  onChangeDistance: (newDistance: string) => void
  distance: number
}

function LocationItem(props: LocationItemProps) {
  let classes = useLocationItemStyles()
  let [age, setAge] = useState(10)
  const handleChange = (event: any) => {
    setAge(event.target.value)
  }
  return (
    <div className={classes.locationItem}>
      <AppTypography>Within</AppTypography>
      <FormControl>
        <TextField
          select
          SelectProps={{
            native: true,
            onChange: (e) => {
              props.onChangeDistance(e.target.value as unknown as string)
            },
          }}
          value={props.distance}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={100}>100</option>
        </TextField>
      </FormControl>
      <Typography style={{display: "flex"}}>
        miles of &nbsp;
        <AppTypography fontWeight="bold">{props.location}</AppTypography>
      </Typography>

      <IconButton onClick={props.onDelete} size="small">
        <Cancel fontSize="small" />
      </IconButton>
    </div>
  )
}
