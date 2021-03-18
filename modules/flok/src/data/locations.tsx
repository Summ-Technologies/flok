export type EmployeeLocation = {
  id: string
  country: string
  city?: string
  name?: string
  type: LocationType
}

// should be moved to a utils file but here for now because just test data
export function getLabel(location: EmployeeLocation): string {
  return location.name
    ? location.name
    : `${
        location.city
          ? location.city + ", " + location.country
          : location.country
      }`
}

export const EMPLOYEE_LOCATIONS: EmployeeLocation[] = [
  {
    id: "1",
    city: "Miami",
    country: "United States",
    type: "CITY",
  },
  {
    id: "2",
    city: "New York City",
    country: "United States",
    type: "CITY",
  },
  {
    id: "3",
    city: "San Francisco",
    country: "United States",
    name: "SFO Int'l Airport",
    type: "AIRPORT",
  },
  {
    id: "4",
    city: "Denver",
    country: "United States",
    type: "CITY",
  },
  {
    id: "5",
    city: "San Francisco",
    country: "United States",
    type: "CITY",
  },
  {
    id: "6",
    country: "India",
    type: "COUNTRY",
  },
]

type LocationType = "CITY" | "COUNTRY" | "AIRPORT"
