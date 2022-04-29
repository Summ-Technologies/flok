import {
  Fade,
  IconButton,
  makeStyles,
  Menu,
  MenuItemProps,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow as AppTableRow,
  Tooltip,
} from "@material-ui/core"
import Table from "@material-ui/core/Table"
import {MoreVert, SwapVert} from "@material-ui/icons"
import React, {ReactElement, useState} from "react"
import AppTypography from "./AppTypography"
type ExpandableRowProps<T> = {
  item: {id: number} & T
  headers: AppTableHeaderType<T>[]
  body?: JSX.Element
  disabled?: boolean
  tooltip?: string
  menuItems?: ReactElement<MenuItemProps>[]
}

const useExpandableRowStyles = makeStyles({
  mainRow: {
    position: "relative",
    "& > *": {
      borderBottom: "unset",
    },
    "& > :first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "& > :nth-last-child(1)": {
      borderRadius: "0 10px 10px 0",
    },
  },
  mainRowDisabled: {
    position: "relative",
    "& > *": {
      borderBottom: "unset",
    },
    "& > :first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "& > :nth-last-child(1)": {
      borderRadius: "0 10px 10px 0",
    },
    backgroundColor: "#AAA",
  },
  expandRow: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  cell: {
    backgroundColor: "#FFF",
  },
  cellDisabled: {
    backgroundColor: "#AAA",
  },
  expandCell: {
    padding: "10px 0 0 0",
    // borderRadius: "0 0 10px 10px",
  },
  expandBody: {
    background: "#E2E5EC",
    // borderRadius: "0 0 10px 10px",
  },
  deleteBtn: {
    // backgroundColor: "transparent",
    margin: "auto",
  },
})

function ExpandableRow<T>(props: ExpandableRowProps<T>) {
  let classes = useExpandableRowStyles()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const menuOpen = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Tooltip title={props.tooltip ? props.tooltip : ""}>
        <AppTableRow
          className={
            props.disabled ? classes.mainRowDisabled : classes.mainRow
          }>
          {props.headers.map((header, i) => (
            <TableCell
              key={i}
              className={props.disabled ? classes.cellDisabled : classes.cell}>
              {header.renderCell ? (
                header.renderCell(props.item[header.colId])
              ) : (
                <AppTypography>{props.item[header.colId]}</AppTypography>
              )}
            </TableCell>
          ))}
          {/* <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell> */}
          {props.menuItems && props.menuItems.length && (
            <TableCell
              className={props.disabled ? classes.cellDisabled : classes.cell}>
              <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={menuOpen}
                onClose={handleClose}
                TransitionComponent={Fade}>
                {props.menuItems}
              </Menu>
              <IconButton
                size="small"
                aria-controls="fade-menu"
                aria-haspopup="true"
                onClick={(event) => {
                  setAnchorEl(event.currentTarget)
                }}>
                <MoreVert />
              </IconButton>
            </TableCell>
          )}
        </AppTableRow>
        {/* <TableRow className={classes.expandRow}>
        <TableCell
          className={classes.expandCell}
          colSpan={props.cols.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.expandBody}>{props.body}</div>
          </Collapse>
        </TableCell>
      </TableRow> */}
      </Tooltip>
    </React.Fragment>
  )
}

const useTableStyles = makeStyles({
  root: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 16px",
  },
  body: {
    // background: "#FFF",
    // "& > :first-child": {
    //   "& > :first-child": {
    //     borderRadius: "10px 0 0 0",
    //   },
    //   "& > :last-child": {
    //     borderRadius: "0 10px 0 0",
    //   },
    // },
    // "& > :last-child": {
    //   "& > :first-child": {
    //     borderRadius: "0 0 10px 10px",
    //     borderBottom: "unset",
    //   },
    // },
  },
  header: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  headerCell: {
    display: "flex",
    alignItems: "center",
  },
})

type AppTableRowType<T> = {
  disabled?: boolean
  tooltip?: string
  item: {id: number} & T
}
type AppTableHeaderType<T> = {
  name: string
  colId: keyof T
  comparator?: (r1: AppTableRowType<T>, r2: AppTableRowType<T>) => number
  renderCell?: (val: T[keyof T]) => JSX.Element
}
type AppExpandableTableProps<T> = {
  headers: AppTableHeaderType<T>[]
  rows: AppTableRowType<T>[]
  menuItems?: (row: AppTableRowType<T>) => ReactElement<MenuItemProps>[]
}

export default function AppExpandableTable<T>(
  props: AppExpandableTableProps<T>
) {
  let classes = useTableStyles()

  let [order, setOrder] = useState<"asc" | "desc">("desc")
  let [orderBy, setOrderBy] = useState<String>("")

  const handleSortClick = (headerName: String) => {
    if (orderBy === headerName) {
      setOrder(order === "asc" ? "desc" : "asc")
    } else {
      setOrderBy(headerName)
      setOrder("desc")
    }
  }

  const getComparator = () => {
    let headerObj = props.headers.filter((h) => h.name === orderBy)[0]
    let fn = (r1: AppTableRowType<T>, r2: AppTableRowType<T>) => 0
    if (headerObj !== undefined && headerObj.comparator) {
      fn = headerObj.comparator
    }
    if (order === "asc") {
      return (r1: AppTableRowType<T>, r2: AppTableRowType<T>) => fn(r1, r2) * -1
    }
    return fn
  }

  return (
    <TableContainer>
      <Table className={classes.root}>
        <TableHead>
          <AppTableRow className={classes.header}>
            {props.headers.map((h, i) => (
              <TableCell key={i}>
                <div className={classes.headerCell}>
                  <AppTypography variant="h3">{h.name}</AppTypography>
                  {h.comparator ? (
                    <IconButton
                      size="small"
                      onClick={() => handleSortClick(h.name)}>
                      <SwapVert />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </div>
              </TableCell>
            ))}
            {/* <TableCell /> */}
          </AppTableRow>
        </TableHead>
        <TableBody className={classes.body}>
          {props.rows
            .slice()
            .sort(getComparator())
            .map((data) => (
              <ExpandableRow
                key={data.item.id}
                item={data.item}
                headers={props.headers}
                disabled={data.disabled}
                tooltip={data.tooltip}
                menuItems={props.menuItems ? props.menuItems(data) : undefined}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
