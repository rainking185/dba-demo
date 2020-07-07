import { createSlice } from "@reduxjs/toolkit"

const appSlice = createSlice({
  name: 'app',
  initialState: {
    currency: "",
    toast: {
      shown: false,
      message: ""
    }
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
    }
  }
})

export const { hideToast, showToast, setCurrency } = appSlice.actions

export default appSlice.reducer