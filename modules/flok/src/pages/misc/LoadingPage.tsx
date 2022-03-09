import {Box, CircularProgress} from "@material-ui/core"
import React from "react"
import PageContainer from "../../components/page/PageContainer"

type LoadingPageProps = {}
export default function LoadingPage(props: LoadingPageProps) {
  return (
    <PageContainer>
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center">
        <CircularProgress />
      </Box>
    </PageContainer>
  )
}
