import { AndroidPermissions } from '@ionic-native/android-permissions';

export const requestPermissions = () =>
  AndroidPermissions.requestPermissions(
    [AndroidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]
  )

export const checkPermissions = () =>
  new Promise(async (resolve) => {
    try {
      let res = await AndroidPermissions.checkPermission(
        AndroidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      let per1 = res.hasPermission
      res = await AndroidPermissions.checkPermission(
        AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      )
      let per2 = res.hasPermission
      resolve(per1 && per2)
    } catch (e) {
      if (e === "cordova_not_available") resolve(true)
      else console.log(e)
    }
  })