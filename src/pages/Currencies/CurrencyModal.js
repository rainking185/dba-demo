import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { addCurrency } from '../../features/profile'
import { showToast } from '../../features/app'
import { areLetters } from '../../utils/regex'
import { L } from '../../utils/language'
import FormModalContainer from '../../common/containers/FormModalContainer'
import CurrencyForm from '../../common/form/CurrencyForm'

const CurrencyModal = props => {

  const data = useSelector(state => state.profile.data)
  const journal = useSelector(state => state.profile.journal)
  const dispatch = useDispatch()
  const l = useSelector(state => state.profile.language)

  const defaultFormValue = {
    currency: null,
    savings: '',
    dailyBudget: ''
  }
  const [formValue, setFormValue] = useState(defaultFormValue)

  const handleChange = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const clearForm = () => {
    setFormValue(defaultFormValue)
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.currency === null) err += L("What is the new currency? ", l)
    else if (formValue.currency.length !== 3
      || !areLetters(formValue.currency))
      err += L("Currency with 3 letters only. ", l)
    else if (Object.keys(data.currencies).includes(formValue.currency))
      err += "You already have this currency. "
    if (formValue.savings === '') err += L("Please add your savings. ", l)
    if (formValue.dailyBudget === '') err += L("Please enter your daily budget. ", l)
    else if (Number(formValue.dailyBudget) < 0)
      err += L("Daily budget cannot be negative. ", l)

    if (err !== "") {
      dispatch(showToast(err))
      return false
    }
    else {
      let currency = formValue.currency.toUpperCase()
      dispatch(addCurrency({
        currency: currency,
        dailyBudget: Number(formValue.dailyBudget),
        savings: Number(formValue.savings)
      }, data, journal))
      clearForm()
      dispatch(showToast(L("New currency added.", l)))
      return true
    }
  }

  return <FormModalContainer
    title="Create Currency"
    clearHandler={clearForm}
    submitHandler={handleSubmit}
  >
    <CurrencyForm
      formValue={formValue}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  </FormModalContainer>
}

export default CurrencyModal