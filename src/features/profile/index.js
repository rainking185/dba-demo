import { createSlice } from "@reduxjs/toolkit"
import { fetchAll, updateJournal, updateData, updateSchedules, updateIncome } from './thunks'
import { getBudgetMonth, update as updateAsync, audit as auditAsync } from './utils'

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loaded: false,
    data: {},
    journal: [],
    schedules: [],
    income: [],
    language: "en"
  },
  reducers: {
    setJournal(state, action) {
      return {
        ...state,
        journal: action.payload
      }
    },
    setSchedules(state, action) {
      return {
        ...state,
        schedules: action.payload
      }
    },
    setData(state, action) {
      return {
        ...state,
        data: action.payload
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
          lastEdited: new Date().toDateString(),
          currencyToUse: currency
        }
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
        let newCurrencies = { ...profile.data.currencies }
        delete newCurrencies[currency]
        let newData = {
          ...profile.data,
          lastEdited: new Date().toDateString(),
          currencies: newCurrencies
        }
        let newSchedules = [...profile.schedules].filter(schedule => {
          return schedule.currency !== currency
        })
        let newJournal = [...profile.journal].filter(entry => {
          return entry.currency !== currency
        })
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
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
            [currency]: {
              ...data.currencies[currency],
              dailyBudget: amount
            }
          }
        }
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
          description: description,
        }])

        let remainingToday =
          data.currencies[currency].remainingToday + amount
        let remainingMonth =
          data.currencies[currency].remainingMonth + amount
        let savings =
          data.currencies[currency].savings + amount

        let newData = {
          ...data,
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
            [currency]: {
              ...data.currencies[currency],
              remainingToday: remainingToday,
              remainingMonth: remainingMonth,
              savings: savings
            }
          }
        }
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
          data.currencies[currency].remainingToday
        let budgetToday =
          data.currencies[currency].budgetToday
        if (date === new Date().toDateString()) {
          remainingToday -= amount
          if (description === "Daily Budget") budgetToday -= amount
        }
        let remainingMonth = data.currencies[currency].remainingMonth
        let budgetMonth = data.currencies[currency].budgetMonth
        if (new Date(date).getMonth() === new Date().getMonth()) {
          remainingMonth -= amount
          if (description === "Daily Budget") budgetMonth -= amount
        }
        let savings = data.currencies[currency].savings - amount
        let newData = {
          ...data,
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
            [currency]: {
              ...data.currencies[currency],
              budgetToday: budgetToday,
              remainingToday: remainingToday,
              budgetMonth: budgetMonth,
              remainingMonth: remainingMonth,
              savings: savings
            }
          }
        }
        let newJournal = [...journal]
        newJournal.splice(newJournal.indexOf(entry), 1)
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
          data.currencies[currency].monthlyIncome + monthlyAmount

        let newData = {
          ...data,
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
            [currency]: {
              ...data.currencies[currency],
              monthlyIncome: monthlyIncome
            }
          }
        }
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
          data.currencies[currency].monthlyIncome - monthlyAmount
        let newData = {
          ...data,
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
            [currency]: {
              ...data.currencies[currency],
              monthlyIncome: monthlyIncome
            }
          }
        }
        let newSchedules = [...schedules]
        newSchedules.splice(newSchedules.indexOf(schedule), 1)
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
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
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
              imEarning: false,
              totalIncome: 0,
              remainingIncome: 0
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
        return {
          payload: {
            journal: newJournal,
            data: newData
          }
        }
      }
    },
    addIncome: {
      reducer(state, action) {
        const { income, data } = action.payload
        return {
          ...state,
          data: data,
          income: income
        }
      },
      prepare(form, data, income) {
        const { amount, currency } = form
        let newIncome = income.concat([{
          currency: currency,
          date: new Date().toDateString(),
          amount: amount,
          description: "Income"
        }])

        let remainingIncome =
          data.currencies[currency].remainingIncome + amount
        let totalIncome =
          data.currencies[currency].totalIncome + amount

        let newData = {
          ...data,
          lastEdited: new Date().toDateString(),
          currencies: {
            ...data.currencies,
            [currency]: {
              ...data.currencies[currency],
              remainingIncome: remainingIncome,
              totalIncome: totalIncome
            }
          }
        }
        return {
          payload: {
            data: newData,
            income: newIncome
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
              savings: savings + dailyBudget,
              monthlyIncome: 0,
              imEarning: false,
              totalIncome: 0,
              remainingIncome: 0
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
        const { data, journal, income } = action.payload
        return {
          ...state,
          data: data,
          journal: journal,
          income: income
        }
      },
      prepare(oldData, oldJournal, schedules, oldIncome) {
        let { data, journal, income } = updateAsync(
          oldData, oldJournal, schedules, oldIncome
        )
        return {
          payload: {
            data: data,
            journal: journal,
            income: income
          }
        }
      }
    },
    reset(state) {
      return {
        ...state,
        data: null,
        journal: [],
        schedules: []
      }
    },
    audit: {
      reducer(state, action) {
        return {
          ...state,
          data: action.payload
        }
      },
      prepare(oldData, journal, schedules, income) {
        let data = auditAsync(oldData, journal, schedules, income)
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
        let currencies = { ...data.currencies }
        let newCurrencies = {}
        let currencyNames = Object.keys(data.currencies)
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
          lastEdited: new Date().toDateString(),
          currencies: newCurrencies
        }
        return { payload: newData }
      }
    },
    toggleImEarning(state, action) {
      const currency = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          lastEdited: new Date().toDateString(),
          currencies: {
            ...state.data.currencies,
            [currency]: {
              ...state.data.currencies[currency],
              imEarning: !state.data.currencies[currency].imEarning
            }
          }
        }
      }
    }
  },
  extraReducers: {
    [fetchAll.fulfilled]: (state, action) => {
      const {
        journal,
        schedules,
        data,
        income,
        language
      } = action.payload
      return {
        ...state,
        journal: journal,
        schedules: schedules,
        data: data,
        income: income,
        language: language,
        loaded: true
      }
    }
  }
})

export { fetchAll, updateJournal, updateData, updateSchedules, updateIncome }

export const {
  addEntry, deleteEntry, addSchedule, addCurrency, setData, setJournal,
  setSchedules, setLoaded, initProfile, changeCurrency, deleteCurrency,
  changeDailyBudget, deleteSchedule, update, reset, reorderCurrency, audit,
  toggleImEarning, addIncome
} = profileSlice.actions

export default profileSlice.reducer