import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
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

function HotelSourcingPage() {
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
  let [locationList, setLocationList] = useState<number[]>([])

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
      setLocationList(locationListQuery.map((str) => parseInt(str)))
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

  let [testValue, setTestValue] = useState(undefined)

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
      <div style={{margin: 16}}>
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
          <DialogContent
            style={{display: "flex", flexDirection: "column", padding: 32}}>
            <AppTypography
              fontWeight="bold"
              style={{marginLeft: 16, marginRight: 16}}>
              You need to fill out an RFP so the hotel has all the information
              they need in order to create their proposal for you.
            </AppTypography>
            <Link
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 16,
              }}
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
            style={{display: "flex", alignItems: "center"}}
            onClick={() => {
              setShowFilters((filters) => !filters)
            }}>
            <Typography>Filters</Typography>

            {showFilters ? <ExpandLess /> : <ExpandMore />}
            <Typography style={{marginLeft: 16}}>
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
              Selected
            </Typography>
          </div>
          {showFilters && (
            <Paper
              style={{
                padding: 16,
              }}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{minWidth: 300}}>
                  <Typography>Locations</Typography>
                  <Autocomplete
                    value={testValue}
                    selectOnFocus
                    disableClearable
                    onChange={(e, value, reason) => {
                      // @ts-ignore
                      setTestValue(destinations[0])
                      if (
                        reason === "select-option" &&
                        value &&
                        locationListQuery.indexOf(value.id.toString()) === -1
                      ) {
                        setLocationListQuery([
                          ...locationListQuery,
                          value.id.toString(),
                        ])
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        value={testValue}
                        {...params}
                        placeholder="Add location"
                      />
                    )}
                    clearOnBlur
                    options={Object.values(destinations)}
                    getOptionLabel={(option) => option.location}></Autocomplete>
                  {locationList.map((id) => {
                    return (
                      <LocationItem
                        location={destinations[id].location}
                        onDelete={() => {
                          let locationsCopy = [...locationListQuery]
                          var index = locationsCopy.indexOf(id.toString())
                          if (index !== -1) {
                            locationsCopy.splice(index, 1)
                          }
                          setLocationListQuery([...locationsCopy])
                        }}
                      />
                    )
                  })}
                </div>
                <div>
                  <Typography>Number of Rooms</Typography>
                  <Slider
                    style={{
                      width: 225,
                      marginTop: 36,
                      marginLeft: 24,
                      marginRight: 24,
                    }}
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
                  <Typography>Maximum Distance From the Airport</Typography>
                  <Slider
                    style={{
                      maxWidth: 225,
                      marginTop: 36,
                      marginLeft: 24,
                      marginRight: 24,
                    }}
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
                  <Typography>Price Range</Typography>

                  <div
                    style={{
                      display: "flex",
                      marginTop: "8px",
                      flexDirection: "column",
                    }}>
                    {priceOptions.map((option) => {
                      return (
                        <FormControlLabel
                          style={{marginRight: "24px"}}
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
                                  let priceRangeQueryCopy = [...priceRangeQuery]
                                  var index =
                                    priceRangeQueryCopy.indexOf(option)
                                  if (index !== -1) {
                                    priceRangeQueryCopy.splice(index, 1)
                                  }
                                  setPriceRangeQuery([...priceRangeQueryCopy])
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
                <div
                  style={{maxWidth: 300, maxHeight: 200, overflow: "scroll"}}>
                  <Typography>Hotel Tags</Typography>
                  {lodgingTags.map((tag) => {
                    return (
                      <FormControlLabel
                        style={{marginRight: "24px"}}
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
            // hotel.num_rooms
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
                <div style={{marginTop: 16, marginLeft: 24, marginRight: 24}}>
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

type LocationItemProps = {
  location: string
  onDelete: () => void
  onChangeDistance?: () => void
}

function LocationItem(props: LocationItemProps) {
  let [age, setAge] = useState(10)
  const handleChange = (event: any) => {
    setAge(event.target.value)
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "8px",
        gap: "8px",
      }}>
      <AppTypography>{props.location}</AppTypography>
      <FormControl>
        <Select onChange={handleChange} value={age}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <IconButton onClick={props.onDelete} size="small">
        <Cancel fontSize="small" />
      </IconButton>
    </div>
  )
}
