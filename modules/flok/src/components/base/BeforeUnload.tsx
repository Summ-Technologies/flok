import React, {useEffect} from "react"
import {Prompt} from "react-router-dom"

type BeforeUnloadProps = {
  when: boolean
  message: string
}
function BeforeUnload(props: BeforeUnloadProps) {
  const alertUser = (e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.returnValue = ""
  }
  useEffect(() => {
    if (props.when) {
      window.addEventListener("beforeunload", alertUser)
      return () => {
        window.removeEventListener("beforeunload", alertUser)
      }
    }
  }, [props.when])
  return <Prompt when={props.when} message={() => props.message} />
}
export default BeforeUnload
