import {
  Box,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  TextField
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import _ from "lodash"
import React, { useState } from "react"
import { User } from "../../models"
import { useRetreatUsers } from "../../utils"
import AppTypography from "../base/AppTypography"

type SearchUserModalProps = {
  onSubmit: (user: User) => void
  open: boolean
  onClose: () => void
}
export default function SearchUserModal(props: SearchUserModalProps) {
  let [input, setInput] = useState("")
  let [users, loading] = useRetreatUsers()
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        maxWidth={500}
        minWidth={400}
        position="fixed"
        top="50%"
        left="50%"
        style={{
          transform: "translate(-50%, -50%)",
        }}>
        <Paper>
          <Box paddingY={4} paddingX={2} display="flex" flexDirection="column">
            <AppTypography variant="body1" fontWeight="bold" paragraph>
              Select User
            </AppTypography>
            <Box display="flex" paddingTop={2}>
              <Autocomplete
                loading={loading}
                clearOnBlur={false}
                fullWidth
                onChange={(e, val) => val && props.onSubmit(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search by user email"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                )}
                options={_.values(users)}
                getOptionLabel={(opt) => opt.email}
                filterOptions={(options, state) => {
                  return options
                    .filter((val) =>
                      val.email.toLowerCase().includes(input.toLowerCase())
                    )
                    .sort((a, b) => {
                      let matchA = a.email
                        .toLowerCase()
                        .indexOf(input.toLowerCase())
                      let matchB = b.email
                        .toLowerCase()
                        .indexOf(input.toLowerCase())
                      return matchA > matchB ? 1 : matchA === matchB ? 0 : -1
                    })
                }}
                renderOption={(option) => {
                  let matchStart = option.email
                    .toLowerCase()
                    .indexOf(input.toLowerCase())
                  let pre = option.email.slice(0, matchStart)
                  let match = option.email.slice(
                    matchStart,
                    matchStart + input.length
                  )
                  let post = option.email.slice(matchStart + input.length)
                  return (
                    <ListItem>
                      <ListItemText>
                        {pre}
                        <strong>{match}</strong>
                        {post}
                        {option.last_name && ", " + option.last_name}
                        {option.first_name && ", " + option.first_name}
                      </ListItemText>
                    </ListItem>
                  )
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Modal>
  )
}
