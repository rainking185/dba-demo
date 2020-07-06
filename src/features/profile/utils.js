import { setData, setJournal } from './storage'

export const monthlyIndices = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
  '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
  '28'
]
export const weeklyIndices = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export const getAllowance = (savings, percentage = 0.03) => {
  if (savings > 0) return savings * percentage
  else return 0
}

const getDaysInCurrentMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const getDaysRemaining = (date = new Date()) => {
  return getDaysInCurrentMonth() - date.getDate() + 1
}

export const getBudgetMonth = (dailyBudget) => {
  return dailyBudget * getDaysRemaining()
}

export const currencyFilter = (array, currency) => {
  return array.filter(element => {
    return element.currency === currency
  })
}

export const getSummary = (currency, data, journal, schedules = []) => {
  let summary = {
    remainingToday: 0,
    budgetToday: 0,
    remainingMonth: 0,
    budgetMonth: 0,
    savings: 0,
    monthlyIncome: 0,
    allowance: 0
  }

  let journalExtract = currencyFilter(journal, currency)
  summary.remainingToday = journalExtract.filter(entry => {
    return entry.date === new Date().toDateString()
  }).reduce((prev, cur) => {
    return prev + cur.amount
  }, 0)
  summary.budgetToday = data.profile.currencies[currency].budgetToday
  summary.remainingMonth = data.profile.currencies[currency].remainingMonth
  summary.budgetMonth = data.profile.currencies[currency].budgetMonth
  summary.savings = journalExtract.reduce((prev, cur) => {
    return prev + cur.amount
  }, 0)

  summary.monthlyIncome = schedules.filter(schedule => {
    return schedule.currency === currency
  }).reduce((prev, cur) => {
    if (cur.type === "Monthly") return prev + cur.amount
    else return prev + cur.amount * 4
  }, 0)

  summary.allowance = getAllowance(summary.savings)
  return summary
}

export const getCurrenciesSummary = (currencies) => {
  return Object.keys(currencies).reduce((prev, cur) => {
    return prev.concat({
      name: cur,
      savings: currencies[cur].savings
    })
  }, [])
}

export const getUnregisteredCurrencies = (data) => {
  let registeredCurrencies = Object.keys(data.profile.currencies)
  return data.currencies.filter(currency => {
    return !registeredCurrencies.includes(currency)
  })
}

export const update = (data, journal, schedules) => {
  console.log("in update")
  let today = new Date().toDateString()
  if (today === data.profile.lastEdited) return {
    data: data,
    journal: journal
  }

  let todayDate = new Date(today)
  let diff = new Date(todayDate - new Date(data.profile.lastEdited)).getDate() - 1

  let newJournal = [...journal]
  let newSchedules = [...schedules]
  let newData = { ...data }
  let currencies = { ...newData.profile.currencies }

  let lastEdited = new Date(data.profile.lastEdited)
  let lastlastEdited = lastEdited
  lastEdited.setDate(lastEdited.getDate() + 1)

  if (newData.profile.currencyInUse !== newData.profile.currencyToUse) {
    let currencyInUse = newData.profile.currencyInUse
    let currencyToUse = newData.profile.currencyToUse

    let budgetMonth = currencies[currencyInUse].budgetMonth - currencies[currencyInUse].budgetToday * getDaysRemaining(lastEdited)
    let budgetToday = 0
    currencies[currencyInUse] = {
      ...currencies[currencyInUse],
      budgetMonth: budgetMonth,
      budgetToday: budgetToday
    }
    budgetToday = currencies[currencyToUse].dailyBudget
    budgetMonth = currencies[currencyToUse].budgetMonth + budgetToday * getDaysRemaining(lastEdited)
    currencies[currencyToUse] = {
      ...currencies[currencyToUse],
      budgetMonth: budgetMonth,
      budgetToday: budgetToday
    }
    newData.profile.currencyInUse = currencyToUse
  }

  let currencyInUse = newData.profile.currencyInUse
  if (currencies[currencyInUse].budgetToday !== currencies[currencyInUse].dailyBudget) {
    let budgetMonth = currencies[currencyInUse].budgetMonth + getDaysRemaining(lastEdited) * (currencies[currencyInUse].dailyBudget - currencies[currencyInUse].budgetToday)
    let budgetToday = currencies[currencyInUse].dailyBudget
    currencies[currencyInUse] = {
      ...currencies[currencyInUse],
      budgetMonth: budgetMonth,
      budgetToday: budgetToday
    }
  }

  for (let i = 0; i < diff; i++) {
    if (lastlastEdited.getMonth() !== lastEdited.getMonth()) {
      Object.keys(currencies).forEach(currency => {
        let budgetMonth = currencies[currencyInUse].budgetToday * getDaysInCurrentMonth(lastEdited)
        currencies[currency] = {
          ...currencies[currency],
          budgetMonth: budgetMonth,
          remainingMonth: budgetMonth
        }
      })
    }
    newJournal.push({
      currency: currencyInUse,
      amount: currencies[currencyInUse].budgetToday,
      date: lastEdited.toDateString(),
      description: "Daily Budget"
    })

    let remainingToday = currencies[currencyInUse].budgetToday
    let savings = currencies[currencyInUse].savings + currencies[currencyInUse].budgetToday
    let allowance = getAllowance(savings)
    currencies[currencyInUse] = {
      ...currencies[currencyInUse],
      remainingToday: remainingToday,
      savings: savings,
      allowance: allowance
    }

    newSchedules.forEach(schedule => {
      if ((schedule.type === "Monthly" && schedule.index === lastEdited.getDate())
        || (schedule.type === "Weely" && weeklyIndices.indexOf(schedule.index) === todayDate.getDay())) {
        newJournal.push({
          currency: schedule.currency,
          amount: schedule.amount,
          description: "Scheduled " + schedule.description,
          date: lastEdited.toDateString()
        })
        let savings = currencies[schedule.currency].savings + schedule.amount
        let remainingMonth = currencies[schedule.currency].remainingMonth + schedule.amount
        currencies[schedule.currency] = {
          ...currencies[schedule.currency],
          savings: savings,
          remainingMonth: remainingMonth
        }
      }
    })
    lastEdited.setDate(lastEdited.getDate() + 1)
  }
  newData = {
    ...newData,
    profile: {
      ...newData.profile,
      lastEdited: new Date().toDateString(),
      currencies: currencies
    }
  }
  setData(newData)
  setJournal(newJournal)
  console.log(newJournal)
  return {
    data: newData,
    journal: newJournal
  }
}