import { createAsyncThunk } from "@reduxjs/toolkit"
import { getData, getJournal, getSchedules } from './storage'
import { Plugins } from '@capacitor/core';
// import { clearStorage } from "./storage"
const { Storage } = Plugins;


export const updateJournal = createAsyncThunk(
  'profile/updateJournal',
  async (journal, thunkAPI) => {
    try {
      await Storage.set({ key: 'DBAjournal', value: JSON.stringify(journal) })
    } catch (e) {
      console.log(e)
    }
  }
)

export const updateSchedules = createAsyncThunk(
  'profile/updateSchedules',
  async (schedules, thunkAPI) => {
    try {
      await Storage.set({
        key: 'DBAschedules',
        value: JSON.stringify(schedules)
      })
    } catch (e) {
      console.log(e)
    }
  }
)

export const updateData = createAsyncThunk(
  'profile/updateData',
  async (data, thunkAPI) => {
    try {
      await Storage.set({ key: 'DBAdata', value: JSON.stringify(data) })
    } catch (e) {
      console.log(e)
    }
  }
)

export const fetchAll = createAsyncThunk(
  'profile/getAll',
  async (arg, thunkAPI) => {
    try {
      // await clearStorage()
      let journal = await getJournal()
      let schedules = await getSchedules()
      let data = await getData()
      return {
        journal: journal,
        schedules: schedules,
        data: data
      }
    } catch (err) {
      console.error(err)
    }
  }
)