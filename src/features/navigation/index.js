import { createSlice } from "@reduxjs/toolkit"

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    location: "summary",
    currency: ""
  },
  reducers: {
    setLocation(state, action) {
      return {
        ...state,
        location: action.payload
      }
    },
    setCurrency(state, action) {
      return {
        ...state,
        currency: action.payload
      }
    }
  }
})

export const { setLocation, setCurrency } = navigationSlice.actions

export default navigationSlice.reducer