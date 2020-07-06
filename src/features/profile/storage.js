import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
export const clearStorage = async () => {
  await Storage.clear()
}

export const setData = async (data) => {
  await Storage.set({
    key: 'DBAdata',
    value: JSON.stringify(data)
  });
}

export const setJournal = async (journal) => {
  await Storage.set({
    key: 'DBAjournal',
    value: JSON.stringify(journal)
  });
}

export const setSchedules = async (schedules) => {
  await Storage.set({
    key: 'DBAschedules',
    value: JSON.stringify(schedules)
  });
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

