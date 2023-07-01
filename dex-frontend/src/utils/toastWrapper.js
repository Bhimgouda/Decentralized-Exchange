import { toast } from "react-hot-toast";

export const error = (message)=>{
    return toast.error(message, {
        position: "top-right"
    })
}

export const success = (message)=>{
    return toast.success(message, {
        position: "top-right"
    })
}

export const info = (message)=>{
    toast(message, {
        position: "top-right",
    })
}

