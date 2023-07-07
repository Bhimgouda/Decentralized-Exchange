import React from "react"
import ClipLoader from "react-spinners/ClipLoader"

const LoadingOverlay = ({loading}) => {
    return loading ? (
            <div className="app__overlay">
                <ClipLoader color="#fb0" size="100px" />
            </div>
        ) : null
}
 
export default LoadingOverlay;