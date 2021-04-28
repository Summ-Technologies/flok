import {Box, Divider, makeStyles, Paper} from "@material-ui/core"
import {InfoRounded, KeyboardArrowLeftRounded} from "@material-ui/icons"
import {useDispatch, useSelector} from "react-redux"
import {RetreatProposal} from "../../models/retreat"
import {deleteSelectedProposal} from "../../store/actions/retreat"
import RetreatGetters from "../../store/getters/retreat"
import AppButton from "../base/AppButton"
import AppImage from "../base/AppImage"
import AppList, {AppListItem} from "../base/AppList"
import AppTypography from "../base/AppTypography"
import RetreatDetailsFilter from "./RetreatDetailsFilter"

const FLOK_FEE: number = 250
const FLOK_DISCOUNT: number = 0.5

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  note: {
    backgroundColor: theme.palette.primary.light,
  },
}))

type RetreatPaymentReviewProps = {
  proposal: RetreatProposal
  numEmployees: number
  updateNumEmployees: (newVal: number) => void
}

export default function RetreatPaymentReview(props: RetreatPaymentReviewProps) {
  const classes = useStyles(props)
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)

  return (
    <Paper elevation={1} className={classes.root}>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="center">
        <Box width={350} height="100%" margin={2}>
          <Box position="absolute" paddingLeft={2} paddingTop={2}>
            <AppButton
              variant="contained"
              fullWidth
              onClick={() => {
                if (userRetreat)
                  dispatch(deleteSelectedProposal(userRetreat.id))
              }}>
              <KeyboardArrowLeftRounded fontSize="inherit" />
              go back to proposals
            </AppButton>
          </Box>
          <Box height="100%">
            <AppImage alt="test" img={props.proposal.imageUrl} />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          width={"50%"}
          minWidth={475}
          paddingLeft={3}
          paddingRight={3}
          paddingBottom={1}>
          <AppList>
            <AppListItem
              header={
                <AppTypography variant="h2">
                  {props.proposal.title}
                </AppTypography>
              }
            />
            <Divider />
            <AppListItem
              header={
                <Box flex={1}>
                  <RetreatDetailsFilter
                    guests={props.numEmployees}
                    setGuests={props.updateNumEmployees}
                    size="small"
                  />
                </Box>
              }
              body={
                <AppTypography italic variant="body2">
                  $18,000 total trip estimate <InfoRounded fontSize="inherit" />
                </AppTypography>
              }
            />
            <Divider />
            <AppListItem
              header={
                <AppTypography variant="body1">Flok planning fee</AppTypography>
              }
              subheader={
                <AppTypography
                  variant="body2"
                  color={
                    "textSecondary"
                  }>{`${props.numEmployees} employees x $${FLOK_FEE} per person`}</AppTypography>
              }
              body={
                <AppTypography>
                  ${(FLOK_FEE * props.numEmployees).toLocaleString()}
                </AppTypography>
              }
            />
            <AppListItem
              header={
                <AppTypography variant="body1">
                  {FLOK_DISCOUNT * 100}% discount on Flok fee
                </AppTypography>
              }
              body={
                <AppTypography>
                  -$
                  {(
                    FLOK_DISCOUNT *
                    (props.numEmployees * FLOK_FEE)
                  ).toLocaleString()}
                </AppTypography>
              }
            />
            <Divider />
            <AppListItem
              header={
                <AppTypography bold variant="body1">
                  What you pay now
                </AppTypography>
              }
              body={
                <AppTypography bold>
                  $
                  {(
                    props.numEmployees * FLOK_FEE -
                    FLOK_DISCOUNT * (props.numEmployees * FLOK_FEE)
                  ).toLocaleString()}
                </AppTypography>
              }
            />
          </AppList>
          <Box padding={1} width="100%">
            <Paper classes={{root: classes.note}}>
              <Box padding={2}>
                <AppTypography variant="body1" bold>
                  Note:
                </AppTypography>
                <AppTypography variant="body1">
                  1) This fee is fully refundable <br />
                  2) You can continue to add or subtract employees, Flok will
                  adjust your price according the final number of retreat
                  attendees
                </AppTypography>
              </Box>
            </Paper>
          </Box>
          <Box paddingLeft={1} paddingRight={1} marginBottom={1} marginTop={1}>
            <AppButton
              onClick={() => undefined}
              variant="contained"
              color="primary"
              fullWidth>
              Pay ${" "}
              {(
                props.numEmployees * FLOK_FEE -
                FLOK_DISCOUNT * (props.numEmployees * FLOK_FEE)
              ).toLocaleString()}{" "}
              now
            </AppButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
