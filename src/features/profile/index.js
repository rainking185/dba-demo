import { createSlice } from "@reduxjs/toolkit"
import { fetchAll } from './thunks'
import {
  setData as setData2Storage,
  setJournal as setJournal2Storage,
  setSchedules as setSchedules2Storage
} from './storage'
import { getAllowance, getBudgetMonth, update as updateAsync, audit as auditAsync } from './utils'

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loaded: false,
    data: {},
    journal: [],
    schedules: []
  },
  reducers: {
    setJournal: {
      reducer(state, action) {
        return {
          ...state,
          journal: action.payload
        }
      },
      prepare(journal) {
        setJournal2Storage(journal)
        return { payload: journal }
      }
    },
    setSchedules: {
      reducer(state, action) {
        return {
          ...state,
          schedules: action.payload
        }
      },
      prepare(schedules) {
        setSchedules2Storage(schedules)
        return { payload: schedules }
      }
    },
    setData: {
      reducer(state, action) {
        return {
          ...state,
          data: action.payload
        }
      },
      prepare(data) {
        setData2Storage(data)
        return { payload: data }
      }
    },
    setLoaded(state, action) {
      return {
        ...state,
        loaded: action.payload
      }
    },
    changeCurrency: {
      reducer(state, action) {
        return {
          ...state,
          data: action.payload
        }
      },
      prepare(currency, data) {
        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencyToUse: currency
          }
        }
        setData2Storage(newData)
        return {
          payload: newData
        }
      }
    },
    deleteCurrency: {
      reducer(state, action) {
        return action.payload
      },
      prepare(currency, profile) {
        let newCurrencies = { ...profile.data.profile.currencies }
        delete newCurrencies[currency]
        let newData = {
          ...profile.data,
          profile: {
            ...profile.data.profile,
            lastEdited: new Date().toDateString(),
            currencies: newCurrencies
          }
        }
        let newSchedules = [...profile.schedules].filter(schedule => {
          return schedule.currency !== currency
        })
        let newJournal = [...profile.journal].filter(entry => {
          return entry.currency !== currency
        })
        setData2Storage(newData)
        setJournal2Storage(newJournal)
        setSchedules2Storage(newSchedules)
        return {
          payload: {
            ...profile,
            data: newData,
            schedules: newSchedules,
            journal: newJournal
          }
        }
      }
    },
    changeDailyBudget: {
      reducer(state, action) {
        return {
          ...state,
          data: action.payload
        }
      },
      prepare(form, data) {
        const { currency, amount } = form
        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: {
              ...data.profile.currencies,
              [currency]: {
                ...data.profile.currencies[currency],
                dailyBudget: amount
              }
            }
          }
        }
        setData2Storage(newData)
        return {
          payload: newData
        }
      }
    },
    addEntry: {
      reducer(state, action) {
        const { journal, data } = action.payload
        return {
          ...state,
          data: data,
          journal: journal
        }
      },
      prepare(form, data, journal) {
        const { amount, description, currency } = form
        let newJournal = journal.concat([{
          currency: currency,
          date: new Date().toDateString(),
          amount: amount,
          description: description
        }])

        let remainingToday =
          data.profile.currencies[currency].remainingToday + amount
        let remainingMonth =
          data.profile.currencies[currency].remainingMonth + amount
        let savings =
          data.profile.currencies[currency].savings + amount

        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: {
              ...data.profile.currencies,
              [currency]: {
                ...data.profile.currencies[currency],
                remainingToday: remainingToday,
                remainingMonth: remainingMonth,
                savings: savings,
                allowance: getAllowance(savings)
              }
            }
          }
        }
        setData2Storage(newData)
        setJournal2Storage(newJournal)
        return {
          payload: {
            data: newData,
            journal: newJournal
          }
        }
      }
    },
    deleteEntry: {
      reducer(state, action) {
        const { journal, data } = action.payload
        return {
          ...state,
          data: data,
          journal: journal
        }
      },
      prepare(entry, data, journal) {
        const { currency, amount, date, description } = entry
        let remainingToday =
          data.profile.currencies[currency].remainingToday
        let budgetToday =
          data.profile.currencies[currency].budgetToday
        if (date === new Date().toDateString()) {
          remainingToday -= amount
          if (description === "Daily Budget") budgetToday -= amount
        }
        let remainingMonth = data.profile.currencies[currency].remainingMonth
        let budgetMonth = data.profile.currencies[currency].budgetMonth
        if (new Date(date).getMonth() === new Date().getMonth()) {
          remainingMonth -= amount
          if (description === "Daily Budget") budgetMonth -= amount
        }
        let savings = data.profile.currencies[currency].savings - amount
        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: {
              ...data.profile.currencies,
              [currency]: {
                ...data.profile.currencies[currency],
                budgetToday: budgetToday,
                remainingToday: remainingToday,
                budgetMonth: budgetMonth,
                remainingMonth: remainingMonth,
                savings: savings,
                allowance: getAllowance(savings)
              }
            }
          }
        }
        let newJournal = [...journal]
        newJournal.splice(newJournal.indexOf(entry), 1)
        setData2Storage(newData)
        setJournal2Storage(newJournal)
        return {
          payload: {
            data: newData,
            journal: newJournal
          }
        }
      }
    },
    addSchedule: {
      reducer(state, action) {
        const { schedules, data } = action.payload
        return {
          ...state,
          data: data,
          schedules: schedules
        }
      },
      prepare(form, data, schedules) {
        const { amount, type, index, description, currency } = form
        let newSchedules = schedules.concat([{
          currency: currency,
          amount: amount,
          type: type,
          index: index,
          description: description
        }])

        let monthlyAmount = amount
        if (type === "Weekly") monthlyAmount *= 4
        let monthlyIncome =
          data.profile.currencies[currency].monthlyIncome + monthlyAmount

        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: {
              ...data.profile.currencies,
              [currency]: {
                ...data.profile.currencies[currency],
                monthlyIncome: monthlyIncome
              }
            }
          }
        }
        setData2Storage(newData)
        setSchedules2Storage(newSchedules)
        return {
          payload: {
            data: newData,
            schedules: newSchedules
          }
        }
      }
    },
    deleteSchedule: {
      reducer(state, action) {
        const { schedules, data } = action.payload
        return {
          ...state,
          data: data,
          schedules: schedules
        }
      },
      prepare(schedule, data, schedules) {
        const { currency, amount, type } = schedule
        let monthlyAmount = amount
        if (type === "Weekly") monthlyAmount *= 4
        let monthlyIncome =
          data.profile.currencies[currency].monthlyIncome - monthlyAmount
        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: {
              ...data.profile.currencies,
              [currency]: {
                ...data.profile.currencies[currency],
                monthlyIncome: monthlyIncome
              }
            }
          }
        }
        let newSchedules = [...schedules]
        newSchedules.splice(newSchedules.indexOf(schedule), 1)
        setData2Storage(newData)
        setSchedules2Storage(newSchedules)
        return {
          payload: {
            data: newData,
            schedules: newSchedules
          }
        }
      }
    },
    addCurrency: {
      reducer(state, action) {
        const { journal, data } = action.payload
        return {
          ...state,
          data: data,
          journal: journal
        }
      },
      prepare(form, data, journal) {
        const { currency, savings, dailyBudget } = form
        const newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: {
              ...data.profile.currencies,
              [currency]: {
                profileCreated: new Date().toDateString(),
                initSavings: savings,
                dailyBudget: dailyBudget,
                budgetToday: 0,
                budgetMonth: 0,
                remainingToday: 0,
                remainingMonth: 0,
                savings: savings,
                monthlyIncome: 0,
                allowance: getAllowance(savings)
              }
            }
          }
        }
        const newJournal = [
          ...journal,
          {
            currency: currency,
            date: new Date().toDateString(),
            amount: savings,
            description: "Initial Savings"
          }
        ]
        setData2Storage(newData)
        setJournal2Storage(newJournal)
        return {
          payload: {
            journal: newJournal,
            data: newData
          }
        }
      }
    },
    initProfile: {
      reducer(state, action) {
        const { data, journal } = action.payload
        return {
          ...state,
          loaded: true,
          data: data,
          journal: journal,
          schedules: []
        }
      },
      prepare(form) {
        const { currency, savings, dailyBudget } = form
        const budgetMonth = getBudgetMonth(dailyBudget)
        const data = {
          currencies: ["JPY", "CNY", "AUD", "SGD", "USD"],
          amountTypes: [
            "Others",
            "Food",
            "Monthly Payment",
            "Transport",
            "Entertainment",
            "Lost",
            "Cloud Storage",
            "VPN",
            "Gift",
            "Trip",
            "Trip Bonus",
            "Grocery",
            "Health",
            "Repair"
          ],
          profile: {
            lastEdited: new Date().toDateString(),
            currencyInUse: currency,
            currencyToUse: currency,
            currencies: {
              [currency]: {
                profileCreated: new Date().toDateString(),
                initSavings: savings,
                dailyBudget: dailyBudget,
                budgetToday: dailyBudget,
                budgetMonth: budgetMonth,
                remainingToday: dailyBudget,
                remainingMonth: budgetMonth,
                savings: savings,
                monthlyIncome: 0,
                allowance: getAllowance(savings)
              }
            }
          }
        }
        const journal = [
          {
            currency: currency,
            date: new Date().toDateString(),
            amount: savings,
            description: "Initial Savings"
          },
          {
            currency: currency,
            date: new Date().toDateString(),
            amount: dailyBudget,
            description: "Daily Budget"
          }
        ]
        setData2Storage(data)
        setJournal2Storage(journal)
        setSchedules2Storage([])
        return {
          payload: {
            data: data,
            journal: journal,
          }
        }
      }
    },
    update: {
      reducer(state, action) {
        const { data, journal } = action.payload
        return {
          ...state,
          data: data,
          journal: journal
        }
      },
      prepare(oldData, oldJournal, schedules) {
        let { data, journal } = updateAsync(oldData, oldJournal, schedules)
        return {
          payload: {
            data: data,
            journal: journal
          }
        }
      }
    },
    reset: {
      reducer(state) {
        return {
          ...state,
          data: null,
          journal: [],
          schedules: []
        }
      },
      prepare() {
        setData2Storage()
        setJournal2Storage([])
        setSchedules2Storage([])
        return { payload: null }
      }
    },
    audit: {
      reducer(state, action) {
        return {
          ...state,
          data: action.payload
        }
      },
      prepare(oldData, journal, schedules) {
        let data = auditAsync(oldData, journal, schedules)
        return {
          payload: data
        }
      }
    },
    reorderCurrency: {
      reducer(state, action) {
        return {
          ...state,
          data: action.payload
        }
      },
      prepare(from, to, data) {
        let currencies = { ...data.profile.currencies }
        let newCurrencies = {}
        let currencyNames = Object.keys(data.profile.currencies)
        let movingCurrencyName = currencyNames[from]
        let movingCurrency = { ...currencies[movingCurrencyName] }
        if (from > to) {
          for (let i = 0; i < currencyNames.length; i++) {
            if (i < to || i > from)
              newCurrencies[currencyNames[i]] = currencies[currencyNames[i]]
            else if (i === to)
              newCurrencies[movingCurrencyName] = movingCurrency
            else if (i <= from)
              newCurrencies[currencyNames[i - 1]]
                = currencies[currencyNames[i - 1]]
          }
        } else {
          for (let i = 0; i < currencyNames.length; i++) {
            if (i > to || i < from)
              newCurrencies[currencyNames[i]] = currencies[currencyNames[i]]
            else if (i === to)
              newCurrencies[movingCurrencyName] = movingCurrency
            else if (i >= from)
              newCurrencies[currencyNames[i + 1]]
                = currencies[currencyNames[i + 1]]
          }
        }
        let newData = {
          ...data,
          profile: {
            ...data.profile,
            lastEdited: new Date().toDateString(),
            currencies: newCurrencies
          }
        }
        setData2Storage(newData)
        return { payload: newData }
      }
    }
  },
  extraReducers: {
    [fetchAll.fulfilled]: (state, action) => {
      return {
        ...state,
        journal: action.payload.journal,
        schedules: action.payload.schedules,
        data: action.payload.data,
        loaded: true
      }
    }
  }
})

export { fetchAll }

export const {
  addEntry, deleteEntry, addSchedule, addCurrency, setData, setJournal,
  setSchedules, setLoaded, initProfile, changeCurrency, deleteCurrency,
  changeDailyBudget, deleteSchedule, update, reset, reorderCurrency, audit
} = profileSlice.actions

export default profileSlice.reducer