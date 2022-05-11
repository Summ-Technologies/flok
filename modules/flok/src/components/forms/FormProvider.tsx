import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import {useDispatch, useSelector} from "react-redux"
import {FormModel} from "../../models/form"
import LoadingPage from "../../pages/misc/LoadingPage"
import {RootState} from "../../store"

const FormContext = createContext<FormModel | undefined>(undefined)

export function useForm() {
  const form = useContext(FormContext)
  if (form === undefined) {
    throw Error("useRetreat must be used within a FormProvider")
  }
  return form
}

type FormProviderProps = PropsWithChildren<{formId: number}>
export default function FormProvider(props: FormProviderProps) {
  let dispatch = useDispatch()
  let [loading, setLoading] = useState(false)
  let form = useSelector(
    (state: RootState) => state.retreat.forms[props.formId]
  )
  useEffect(() => {
    if (!form) {
      setLoading(true)
      // dispatch(getForm(formId))
      setLoading(false)
    }
  }, [form, dispatch])

  return !form && loading ? (
    <LoadingPage />
  ) : !form ? (
    <div>Error loading form</div>
  ) : (
    <FormContext.Provider value={form}>{props.children}</FormContext.Provider>
  )
}
