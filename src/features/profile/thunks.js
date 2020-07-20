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

export const fetchAll = createAsyncThunk(
  'profile/fetchAll',
  async (arg, thunkAPI) => {
    try {
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
      return {
        journal: JSON.parse(journal.data),
        schedules: JSON.parse(schedules.data),
        data: JSON.parse(data.data)
      }
    } catch (err) {
      console.log(err)
      try {
        // For old version using Storage
        let data = await getData()
        let journal = await getJournal()
        let schedules = await getSchedules()
        await Filesystem.writeFile({
          path: 'Sylon/DBA/data.dba',
          data: JSON.stringify(data.profile, null, 2),
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
        // await clearStorage()
        return {
          journal: journal,
          schedules: schedules,
          data: data
        }
      } catch (err) {
        console.log(err)
        return {
          journal: [],
          schedules: [],
          data: null
        }
      }
    }
  }
)