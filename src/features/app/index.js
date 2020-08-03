import { createSlice } from "@reduxjs/toolkit"

const appSlice = createSlice({
  name: 'app',
  initialState: {
    currency: "",
    toast: {
      shown: false,
      message: ""
    },
    showAd: false
  },
  reducers: {
    setCurrency(state, action) {
      return {
        ...state,
        currency: action.payload
      }
    },
    hideToast(state) {
      return {
        ...state,
        toast: {
          shown: false,
          message: ""
        }
      }
    },
    showToast(state, action) {
      return {
        ...state,
        toast: {
          shown: true,
          message: action.payload
        }
      }
    },
    hideAd(state) {
      return {
        ...state,
        showAd: false
      }
    },
    setShowAd(state) {
      return {
        ...state,
        showAd: true
      }
    }
  }
})

export const {
  hideToast, showToast, setCurrency, hideAd, setShowAd
} = appSlice.actions

export default appSlice.reducer