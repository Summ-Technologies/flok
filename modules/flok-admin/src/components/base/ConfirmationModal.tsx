import {Box, Button, Modal, Paper} from "@material-ui/core"
import React from "react"
import AppTypography from "../base/AppTypography"

type ConfirmationModalProps = {
  onSubmit: () => void
  onClose: () => void
  confirmationText: string
  buttonText?: string
}
export default function ConfirmationModal(props: ConfirmationModalProps) {
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
              {props.confirmationText}
            </AppTypography>
            <Box display="flex" justifyContent="center">
              <Button
                color="primary"
                variant="contained"
                onClick={(e) => {
                  e.preventDefault()
                  props.onSubmit()
                  props.onClose()
                }}>
                {props.buttonText || "Yes"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Modal>
  )
}
