import {Typography} from "@material-ui/core"
import {useEffect, useState} from "react"

type AppLoadingIndicatorProps = {
  text?: string // defaults to "Loading"
}

export default function AppLoadingIndicator(props: AppLoadingIndicatorProps) {
  return (
    <Typography variant="body1">
      {props.text ? props.text : "Loading"}
      <AppLoadingDots />
    </Typography>
  )
}

export function AppLoadingDots() {
  let [dots, setDots] = useState<"" | "." | ".." | "...">("")

  useEffect(() => {
    function cycleDots() {
      switch (dots) {
        case "":
          setDots(".")
          break
        case ".":
          setDots("..")
          break
        case "..":
          setDots("...")
          break
        case "...":
          setDots("")
          break
      }
    }
    let cycle = setTimeout(cycleDots, 500)
    return () => clearTimeout(cycle)
  }, [dots, setDots])
  return <span>{dots}</span>
}
