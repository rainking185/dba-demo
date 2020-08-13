import { createAsyncThunk } from "@reduxjs/toolkit"
import {
  Plugins, FilesystemDirectory, FilesystemEncoding
} from '@capacitor/core';
import { checkPermissions, requestPermissions as request } from "../../utils/permission";
const { Device, Filesystem } = Plugins;

export const requestPermissions = createAsyncThunk(
  'app/requestPermissions',
  async (arg, thunkAPI) => {
    try {
      console.log("capcapreq")
      await request()
      console.log("capcapsuc")
      let res = await checkPermissions()
      console.log(res)
      return res
    } catch (e) {
      console.log("capcaperr")
      return false
    }
  }
)

const writeDoc = (name, doc) => {
  return Filesystem.writeFile({
    path: 'Sylon/DBA/' + name + '.dba',
    data: JSON.stringify(doc, null, 2),
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8,
    recursive: true
  })
}

const readDoc = (name) => {
  return Filesystem.readFile({
    path: 'Sylon/DBA/' + name + '.dba',
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8
  })
}

export const updateJournal = createAsyncThunk(
  'app/updateJournal',
  async (journal, thunkAPI) => {
    return (await writeDoc("journal", journal))
  }
)

export const updateSchedules = createAsyncThunk(
  'app/updateSchedules',
  async (schedules, thunkAPI) => {
    return (await writeDoc("schedules", schedules))
  }
)

export const updateData = createAsyncThunk(
  'app/updateData',
  async (data, thunkAPI) => {
    return (await writeDoc("data", data))
  }
)

export const updateIncome = createAsyncThunk(
  'app/updateIncome',
  async (income, thunkAPI) => {
    return (await writeDoc("income", income))
  }
)

export const updateFamily = createAsyncThunk(
  'app/updateFamily',
  async (family, thunkAPI) => {
    return (await writeDoc("family", family))
  }
)

export const fetchAll = createAsyncThunk(
  'profile/fetchAll',
  async (arg, thunkAPI) => {
    let res = await Device.getLanguageCode()
    let language = "en"
    let systemLanguage = res.value
    if (systemLanguage.toLowerCase().includes("cn")
      || systemLanguage.toLowerCase().includes("zh"))
      language = "cn"
    try {
      let hasPermissions = await checkPermissions()
      if (!hasPermissions) {
        return {
          permissionDenied: true,
          journal: [],
          schedules: [],
          income: null,
          data: null,
          language: language,
          family: {
            data: {},
            journal: []
          }
        }
      }
    } catch (e) {
      console.log(e)
    }

    try {
      let journal = await readDoc("journal")
      let schedules = await readDoc("schedules")
      let data = await readDoc("data")
      let income = await readDoc("income")

      journal = JSON.parse(journal.data)
      schedules = JSON.parse(schedules.data)
      data = JSON.parse(data.data)
      income = JSON.parse(income.data)
      let family
      try {
        family = await readDoc("family")
        family = JSON.parse(family.data)
      } catch (e) {
        family = {
          data: {},
          journal: []
        }
        Object.keys(data.currencies).forEach(currency => {
          family.data[currency] = {
            using: false,
            remainingMonth: 0,
            incomeMonth: 0,
            savings: 0
          }
        })
      }
      return {
        permissionDenied: false,
        journal: journal,
        schedules: schedules,
        data: data,
        income: income,
        language: language,
        family: family
      }
    } catch (err) {
      return {
        permissionDenied: false,
        journal: [],
        schedules: [],
        income: null,
        data: null,
        language: language,
        family: {
          data: {},
          journal: []
        }
      }
    }
  }
)