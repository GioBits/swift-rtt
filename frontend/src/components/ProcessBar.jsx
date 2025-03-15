import { useContext } from "react"
import { MediaContext } from "../contexts/MediaContext"
import VerticalStepper from "./VerticalStepper"

const ProcessBar = () => {
  const {currentStep} = useContext(MediaContext)
  console.log("ProcessBar - Current Step:", currentStep);

  return (
    <div>
      <VerticalStepper currentStep={currentStep}/>
    </div>
  )
}

export default ProcessBar