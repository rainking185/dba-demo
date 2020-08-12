export const MMMs = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
  "Dec"
]

export const MMM2M = (MMM) => {
  return MMMs.indexOf(MMM) + 1
}

export const getMonthPickerValue = filter => {
  return new Date(Number(filter.year), MMM2M(filter.month) - 1).toISOString()
}

export const getYearMonthString = dateString => {
  let words = dateString.split(" ")
  return words[3] + " " + words[1]
}