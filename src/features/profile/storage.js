import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export const clearStorage = async () => {
  await Storage.clear()
}

export const getData = async () => {
  const data = await Storage.get({ key: 'DBAdata' })
  return JSON.parse(data.value)
}

export const getJournal = async () => {
  const data = await Storage.get({ key: 'DBAjournal' })
  return JSON.parse(data.value)
}

export const getSchedules = async () => {
  const data = await Storage.get({ key: 'DBAschedules' })
  return JSON.parse(data.value)
}

