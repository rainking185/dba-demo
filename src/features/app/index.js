import { createSlice } from "@reduxjs/toolkit"

const appSlice = createSlice({
  name: 'app',
  initialState: {
    currency: ""
  },
  reducers: {
    setCurrency(state, action) {
      return {
        ...state,
        currency: action.payload
      }
    }
  }
})

export const { setCurrency } = appSlice.actions

export default appSlice.reducer