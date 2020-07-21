import { createAsyncThunk } from "@reduxjs/toolkit"
import { getData, getJournal, getSchedules } from './storage'
import {
  Plugins, FilesystemDirectory, FilesystemEncoding
} from '@capacitor/core';
// import { clearStorage } from "./storage"
const { Filesystem } = Plugins;

export const updateJournal = createAsyncThunk(
  'app/updateJournal',
  async (journal, thunkAPI) => {
    return await Filesystem.writeFile({
      path: 'Sylon/DBA/journal.dba',
      data: JSON.stringify(journal, null, 2),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
      recursive: true
    }).then(res => { return res })
      .catch(err => { throw err })
  }
)

export const updateSchedules = createAsyncThunk(
  'app/updateSchedules',
  async (schedules, thunkAPI) => {
    return await Filesystem.writeFile({
      path: 'Sylon/DBA/schedules.dba',
      data: JSON.stringify(schedules, null, 2),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
      recursive: true
    }).then(res => { return res })
      .catch(err => { throw err })
  }
)

export const updateData = createAsyncThunk(
  'app/updateData',
  async (data, thunkAPI) => {
    return await Filesystem.writeFile({
      path: 'Sylon/DBA/data.dba',
      data: JSON.stringify(data, null, 2),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
      recursive: true
    }).then(res => { return res })
      .catch(err => { throw err })
  }
)

export const updateIncome = createAsyncThunk(
  'app/updateIncome',
  async (income, thunkAPI) => {
    return await Filesystem.writeFile({
      path: 'Sylon/DBA/income.dba',
      data: JSON.stringify(income, null, 2),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
      recursive: true
    }).then(res => { return res })
      .catch(err => { throw err })
  }
)

export const fetchAll = createAsyncThunk(
  'profile/fetchAll',
  async (arg, thunkAPI) => {
    try {
      // await Filesystem.rmdir({
      //   path: 'Sylon/DBA',
      //   directory: FilesystemDirectory.Documents,
      //   recursive: true
      // })
      let journal = await Filesystem.readFile({
        path: 'Sylon/DBA/journal.dba',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      })
      let schedules = await Filesystem.readFile({
        path: 'Sylon/DBA/schedules.dba',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      })
      let data = await Filesystem.readFile({
        path: 'Sylon/DBA/data.dba',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      })
      let income = await Filesystem.readFile({
        path: 'Sylon/DBA/income.dba',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      })
      journal = JSON.parse(journal.data)
      schedules = JSON.parse(schedules.data)
      data = JSON.parse(data.data)
      income = JSON.parse(income.data)
      return {
        journal: journal,
        schedules: schedules,
        data: data,
        income: income
      }
    } catch (err) {
      console.log(err)
      try {
        // For old version using Storage
        let data = await getData()
        let journal = await getJournal()
        let schedules = await getSchedules()
        let newCurrencies = data.profile.currencies
        Object.keys(newCurrencies).forEach(currency => {
          newCurrencies = {
            ...newCurrencies,
            [currency]: {
              ...newCurrencies[currency],
              imEarning: false,
              totalIncome: 0,
              remainingIncome: 0
            }
          }
        })
        data = {
          ...data.profile,
          currencies: newCurrencies
        }
        await Filesystem.writeFile({
          path: 'Sylon/DBA/data.dba',
          data: JSON.stringify(data, null, 2),
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8,
          recursive: true
        })
        await Filesystem.writeFile({
          path: 'Sylon/DBA/journal.dba',
          data: JSON.stringify(journal, null, 2),
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8,
          recursive: true
        })
        await Filesystem.writeFile({
          path: 'Sylon/DBA/schedules.dba',
          data: JSON.stringify(schedules, null, 2),
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8,
          recursive: true
        })
        await Filesystem.writeFile({
          path: 'Sylon/DBA/income.dba',
          data: JSON.stringify([], null, 2),
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8,
          recursive: true
        })
        // await clearStorage()
        return {
          journal: journal,
          schedules: schedules,
          data: data,
          income: []
        }
      } catch (err) {
        console.log(err)
        return {
          journal: [],
          schedules: [],
          income: [],
          data: null
        }
      }
    }
  }
)