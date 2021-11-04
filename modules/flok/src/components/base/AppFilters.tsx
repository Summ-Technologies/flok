import {
  Chip,
  ClickAwayListener,
  makeStyles,
  Popper,
  Tooltip,
} from "@material-ui/core"
import {ArrowDropDown, ArrowDropUp, Info} from "@material-ui/icons"
import {ToggleButtonGroup} from "@material-ui/lab"
import React, {useRef} from "react"
import {FilterQuestionModel} from "../../models/retreat"
import AppTypography from "./AppTypography"

let useMultiSelectStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

type AppMultiSelectProps = {
  options: {value: string; label: string}[]
  selectedValues: string[]
  onSelect: (value: string) => void
}
export function AppMultiSelect(props: AppMultiSelectProps) {
  let classes = useMultiSelectStyles(props)
  return (
    <div className={classes.root}>
      {props.options.map((option) => {
        let selected = props.selectedValues.includes(option.value)
        return (
          <Chip
            label={option.label}
            clickable
            variant={selected ? "default" : "outlined"}
            color={selected ? "primary" : "default"}
            onClick={() => props.onSelect(option.value)}
          />
        )
      })}
    </div>
  )
}

let useSingleSelectStyles = makeStyles((theme) => ({
  root: {},
}))

type AppSingleSelectProps = {
  options: {value: string; label: string}[]
  selectedValue: string
  onSelect: (value: string) => void
}

export function AppSingleSelect(props: AppSingleSelectProps) {
  let classes = useSingleSelectStyles(props)
  return (
    <ToggleButtonGroup className={classes.root}>
      {props.options.map((option) => {
        let selected = props.selectedValue === option.value
        return (
          <Chip
            label={option.label}
            clickable
            variant={selected ? "default" : "outlined"}
            color={selected ? "primary" : "default"}
            onClick={() => props.onSelect(option.value)}
          />
        )
      })}
    </ToggleButtonGroup>
  )
}

let useFilterStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  infoIcon: {
    marginLeft: theme.spacing(0.5),
  },
}))

type RetreatFilterProps = {
  filterQuestion: FilterQuestionModel
  selectedResponsesIds: string[]
  onSelect: (value: string) => void
}

export function RetreatFilter(props: RetreatFilterProps) {
  let classes = useFilterStyles(props)
  let options: {label: string; value: string}[] = []
  let selectedValues: string[] = []
  props.filterQuestion.answers.forEach((answer) => {
    let answerIdStr = answer.id.toString()
    options.push({label: answer.title, value: answerIdStr})
    if (props.selectedResponsesIds.includes(answerIdStr)) {
      selectedValues.push(answerIdStr)
    }
  })
  return (
    <div className={classes.root}>
      <AppTypography variant="h4">
        {props.filterQuestion.title}
        {props.filterQuestion.more_info && (
          <Tooltip title={props.filterQuestion.more_info} placement="right">
            <Info className={classes.infoIcon} fontSize="inherit" />
          </Tooltip>
        )}
      </AppTypography>
      {props.filterQuestion.is_multi_select ? (
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
}

export type AppFilterProps = {
  title: string
  filter: string
  open?: boolean
  toggleOpen: () => void
  popper: JSX.Element
}
export default function PopperFilter(props: AppFilterProps) {
  let classes = useFilterStyles(props)
  let btnRef = useRef<HTMLDivElement>(null)

  return (
    <div className={classes.root}>
      <AppTypography variant="h4">{props.title}</AppTypography>
      <Chip
        ref={btnRef}
        color={props.open ? "primary" : undefined}
        variant={props.open ? "default" : "outlined"}
        onClick={props.toggleOpen}
        label={
          <AppTypography variant="body2">
            {props.filter}{" "}
            {props.open ? (
              <ArrowDropUp fontSize="small" />
            ) : (
              <ArrowDropDown fontSize="small" />
            )}
          </AppTypography>
        }
        clickable
      />
      {props.open ? (
        <ClickAwayListener onClickAway={props.toggleOpen}>
          <Popper anchorEl={btnRef.current} placement="bottom-start" open>
            {props.popper}
          </Popper>
        </ClickAwayListener>
      ) : undefined}
    </div>
  )
}
