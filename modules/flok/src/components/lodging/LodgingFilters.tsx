import {makeStyles} from "@material-ui/core"
import React from "react"
import {FilterQuestionModel} from "../../models/retreat"
import {AppMultiSelect, AppSingleSelect} from "../base/AppFilters"
import AppTypography from "../base/AppTypography"

let useFiltersStyles = makeStyles((theme) => ({
  root: {display: "flex", flexDirection: "column"},
  filters: {
    display: "flex",
    flexDirection: "column",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
  filter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type FiltersSectionProps = {
  type: "LOCATION" | "HOTEL"
  questions: FilterQuestionModel[]
  selectedResponsesIds: string[]
  onSelect: (val: string) => void
}
export function FiltersSection(props: FiltersSectionProps) {
  let classes = useFiltersStyles(props)
  return (
    <div className={classes.root}>
      <AppTypography variant="h3" underline paragraph>
        {props.type === "LOCATION"
          ? "Location Preferences"
          : "Hotel Preferences"}
      </AppTypography>
      <div className={classes.filters}>
        {props.questions.map((filterQuestion) => {
          let options: {label: string; value: string}[] = []
          let selectedValues: string[] = []
          filterQuestion.answers.forEach((answer) => {
            let answerIdStr = answer.id.toString()
            options.push({label: answer.title, value: answerIdStr})
            if (props.selectedResponsesIds.includes(answerIdStr)) {
              selectedValues.push(answerIdStr)
            }
          })
          return (
            <div className={classes.filter}>
              <AppTypography variant="h4">{filterQuestion.title}</AppTypography>
              {filterQuestion.is_multi_select ? (
                <AppMultiSelect
                  onSelect={props.onSelect}
                  selectedValues={props.selectedResponsesIds}
                  options={options}
                />
              ) : (
                <AppSingleSelect
                  onSelect={props.onSelect}
                  selectedValue={
                    options.filter((option) =>
                      props.selectedResponsesIds.includes(option.value)
                    )[0]?.value
                  }
                  options={options}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
