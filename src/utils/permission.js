import { AndroidPermissions } from '@ionic-native/android-permissions';

export const requestPermissions = () => {
  return AndroidPermissions.requestPermissions(
    [AndroidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]
  )
}

export const checkPermissions = () => {
  return new Promise(async (resolve) => {
    let res = await AndroidPermissions.checkPermission(
      AndroidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    )
    let per1 = res.hasPermission
    res = await AndroidPermissions.checkPermission(
      AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
    )
    let per2 = res.hasPermission
    resolve(per1 && per2)
  })
}