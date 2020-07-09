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

// Date inclusive
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
    let budgetMonth = currencies[currencyInUse].budgetMonth
      - currencies[currencyInUse].budgetToday * getDaysRemaining(lastEdited)
    let remainingMonth = currencies[currencyInUse].remainingMonth
      - currencies[currencyInUse].budgetToday * getDaysRemaining(lastEdited)
    let budgetToday = 0
    currencies[currencyInUse] = {
      ...currencies[currencyInUse],
      budgetMonth: budgetMonth,
      remainingMonth: remainingMonth,
      budgetToday: budgetToday
    }
    budgetToday = currencies[currencyToUse].dailyBudget
    budgetMonth = currencies[currencyToUse].budgetMonth
      + budgetToday * getDaysRemaining(lastEdited)
    remainingMonth = currencies[currencyToUse].remainingMonth
      + budgetToday * getDaysRemaining(lastEdited)
    currencies[currencyToUse] = {
      ...currencies[currencyToUse],
      budgetMonth: budgetMonth,
      remainingMonth: remainingMonth,
      budgetToday: budgetToday
    }
    newData = {
      ...newData,
      profile: {
        ...newData.profile,
        currencyInUse: currencyToUse
      }
    }
  }

  let currencyInUse = newData.profile.currencyInUse
  if (currencies[currencyInUse].budgetToday
    !== currencies[currencyInUse].dailyBudget) {
    let diffAmount = getDaysRemaining(lastEdited) * (
      currencies[currencyInUse].dailyBudget
      - currencies[currencyInUse].budgetToday
    )
    let budgetMonth = currencies[currencyInUse].budgetMonth + diffAmount
    let remainingMonth = currencies[currencyInUse].remainingMonth + diffAmount
    let budgetToday = currencies[currencyInUse].dailyBudget
    currencies[currencyInUse] = {
      ...currencies[currencyInUse],
      budgetMonth: budgetMonth,
      remainingMonth: remainingMonth,
      budgetToday: budgetToday
    }
  }


  for (let i = 0; i < diff; i++) {
    if (lastlastEdited.getMonth() !== lastEdited.getMonth()) {
      Object.keys(currencies).forEach(currency => {
        let budgetMonth = currencies[currencyInUse].budgetToday
          * getDaysInCurrentMonth(lastEdited)
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

    Object.keys(currencies).forEach(currency => {
      let remainingToday = currencies[currency].budgetToday
      let savings = currencies[currency].savings
        + currencies[currency].budgetToday
      let allowance = getAllowance(savings)
      currencies[currency] = {
        ...currencies[currency],
        remainingToday: remainingToday,
        savings: savings,
        allowance: allowance
      }
    })

    newSchedules.forEach(schedule => {
      if ((schedule.type === "Monthly"
        && schedule.index === lastEdited.getDate())
        || (schedule.type === "Weely" &&
          weeklyIndices.indexOf(schedule.index) === todayDate.getDay())) {
        newJournal.push({
          currency: schedule.currency,
          amount: schedule.amount,
          description: "Scheduled " + schedule.description,
          date: lastEdited.toDateString()
        })
        let savings = currencies[schedule.currency].savings + schedule.amount
        let remainingMonth =
          currencies[schedule.currency].remainingMonth + schedule.amount
        currencies[schedule.currency] = {
          ...currencies[schedule.currency],
          savings: savings,
          remainingMonth: remainingMonth
        }
      }
    })
    lastlastEdited = lastEdited
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


export const audit = (data, journal, schedules) => {
  let currencies = { ...data.profile.currencies }
  let currencyInUse = data.profile.currencyInUse
  const todayDate = new Date()
  const today = todayDate.toDateString()
  Object.keys(currencies).forEach(currency => {
    let summary = { ...currencies[currency] }
    let journalExtract = [...journal].filter(entry => {
      return entry.currency === currency
    })
    let schedulesExtract = [...schedules].filter(schedule => {
      return schedule.currency === currency
    })

    let remainingToday = journalExtract.filter(entry => {
      return entry.date === today
        && entry.description !== "Initial Savings"
        && !entry.description.includes("Scheduled ")
    }).reduce((prev, cur) => {
      return prev + cur.amount
    }, 0)

    let savings = journalExtract.filter(entry => {
      return entry.currency === currency
    }).reduce((prev, cur) => {
      return prev + cur.amount
    }, 0)

    let budgetToday = journalExtract.filter(entry => {
      return entry.date === today && entry.description === "Daily Budget"
    }).reduce((prev, cur) => {
      return prev + cur.amount
    }, 0)

    let allownce = getAllowance(savings)

    let monthlyIncome = schedulesExtract.reduce((prev, cur) => {
      if (cur.type === "Weekly") return prev + cur.amount * 4
      else return prev + cur.amount
    }, 0)

    let budgetMonth = journalExtract.filter(entry => {
      return new Date(entry.date).getMonth() === todayDate.getMonth()
        && entry.description === "Daily Budget"
    }).reduce((prev, cur) => {
      return prev + cur.amount
    }, (getDaysRemaining() - 1)
    * (currencyInUse === currency ? summary.dailyBudget : 0))

    let remainingMonth = journalExtract.filter(entry => {
      return new Date(entry.date).getMonth() === todayDate.getMonth()
        && entry.description !== "Initial Savings"
        && !entry.description.includes("Scheduled")
    }).reduce((prev, cur) => {
      return prev + cur.amount
    }, (getDaysRemaining() - 1)
    * (currencyInUse === currency ? summary.dailyBudget : 0))

    let newSummary = {
      ...summary,
      remainingToday: remainingToday,
      savings: savings,
      budgetToday: budgetToday,
      allowance: allownce,
      monthlyIncome: monthlyIncome,
      budgetMonth: budgetMonth,
      remainingMonth: remainingMonth
    }

    Object.keys(newSummary).forEach(key => {
      if (newSummary[key] !== summary[key])
        console.log("For " + currency + ": "
          + key + " " + summary[key] + " -> " + newSummary[key])
    })

    currencies = {
      ...currencies,
      [currency]: newSummary
    }

  })
  let newData = {
    ...data,
    profile: {
      ...data.profile,
      lastEdited: new Date().toDateString(),
      currencies: currencies
    }
  }
  setData(newData)
  return newData
}