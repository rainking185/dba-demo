import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IonContent } from '@ionic/react'

import { addEntry } from '../../features/profile'
import { showToast } from '../../features/app'
import { getDescriptions } from '../../features/profile/utils'
import { L } from '../../utils/language'
import FormModalContainer from '../../common/containers/FormModalContainer'
import BooleanInput from '../../common/inputs/BooleanInput'
import AmountInput from '../../common/inputs/AmountInput'
import DescriptionInput from '../../common/inputs/DescriptionInput'
import DescriptionPicker from '../../common/inputs/DescriptionPicker'

const EntryForm = props => {

  const currency = useSelector(state => state.app.currency)
  const journal = useSelector(state => state.profile.journal)
  const data = useSelector(state => state.profile.data)
  const dispatch = useDispatch()
  const descriptions = getDescriptions(journal)
  const l = useSelector(state => state.profile.language)

  const amountRef = useRef(null)
  const descriptionRef = useRef(null)

  const defaultFormValue = {
    isEarning: false,
    amount: '',
    description: ''
  }

  const [formValue, setFormValue] = useState(defaultFormValue)

  const handleChange = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const clearAmount = () => {
    setFormValue({
      ...formValue,
      amount: ''
    })
    amountRef.current.setFocus()
  }

  const clearForm = () => {
    setFormValue(defaultFormValue)
    amountRef.current.setFocus()
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.amount === '') err += L("How much did you spend? ", l)
    else if (Number(formValue.amount) <= 0)
      err += L("Positive amount only please. ", l)
    if (formValue.description === '') err += L("What did you use this for? ", l)

    if (err !== "") {
      dispatch(showToast(err))
      return false
    }
    else {
      let amount = Number(formValue.amount)
      if (!formValue.isEarning) {
        amount = -amount
      }
      dispatch(addEntry({
        currency: currency,
        amount: amount,
        description: formValue.description
      }, data, journal))
      clearAmount()
      dispatch(showToast(L("Entry added.", l)))
      return true
    }
  }

  return <FormModalContainer
    title="Log Entry"
    className="entry-modal"
    clearHandler={clearForm}
    submitHandler={handleSubmit}
    closeOnSubmit={false}
  >
    <IonContent color="light">

      <BooleanInput
        falseLabel="Spending"
        trueLabel="Earning"
        checked={formValue.isEarning}
        onChange={e => handleChange("isEarning", e.detail.checked)}
      />

      <AmountInput
        value={formValue.amount}
        compRef={amountRef}
        onKeyPress={e => {
          if (e.key === "Enter") descriptionRef.current.setFocus()
        }}
        onChange={e => handleChange("amount", e.detail.value)}
      />

      <DescriptionInput
        value={formValue.description}
        compRef={descriptionRef}
        onKeyPress={e => {
          if (e.key === "Enter") handleSubmit()
        }}
        onChange={e => handleChange("description", e.detail.value)}
      />

      <DescriptionPicker
        descriptions={descriptions}
        onClick={description => setFormValue({
          ...formValue,
          description: description
        })} />

    </IonContent>
  </FormModalContainer>
}

export default EntryForm