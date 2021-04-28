import {Box, makeStyles} from "@material-ui/core"
import {RetreatProposal} from "../../models/retreat"
import AppRetreatProposalCard from "./AppRetreatProposalCard"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  list: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(2),
    },
  },
  footer: {
    marginTop: theme.spacing(1),
    width: "100%",
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
}))

type RetreatProposalCardListProps = {
  proposals: RetreatProposal[]
  numNights: number
  numEmployees: number
  selectProposal: (proposalId: number) => void
}

export default function RetreatProposalCardList(
  props: RetreatProposalCardListProps
) {
  let classes = useStyles()

  return (
    <Box className={classes.root}>
      <Box className={classes.list}>
        {props.proposals.map((proposal, i) => {
          return (
            <AppRetreatProposalCard
              key={i}
              title={proposal.title}
              subtitle={`${proposal.flightTimeAvg} hr travel average`}
              imgUrl={proposal.imageUrl}
              numNights={props.numNights}
              numPeople={props.numEmployees}
              flightCost={proposal.flightsCost}
              accomodationCost={proposal.lodgingCost}
              otherCost={proposal.otherCost}
              onSelect={() => props.selectProposal(proposal.id)}
            />
          )
        })}
      </Box>
      {/* <Box className={classes.footer}>
        <Typography>
          <Link
            href="#"
            onClick={(e: SyntheticEvent) => {
              e.preventDefault()
            }}
            variant="body1">
            + Request another proposal
          </Link>
        </Typography>
      </Box> */}
    </Box>
  )
}
