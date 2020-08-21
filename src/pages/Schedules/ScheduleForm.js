import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IonContent } from '@ionic/react'

import { addSchedule } from '../../features/profile'
import { showToast } from '../../features/app'
import { L } from '../../utils/language'
import FormModalContainer from '../../common/containers/FormModalContainer'
import BooleanInput from '../../common/inputs/BooleanInput'
import AmountInput from '../../common/inputs/AmountInput'
import SelectInput from '../../common/inputs/SelectInput'
import DescriptionInput from '../../common/inputs/DescriptionInput'

const types = ["Monthly", "Weekly"]
const monthlyIndices = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
  '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
  '28'
]
const weeklyIndices = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const ScheduleForm = props => {

  const currency = useSelector(state => state.app.currency)
  const schedules = useSelector(state => state.profile.schedules)
  const data = useSelector(state => state.profile.data)
  const dispatch = useDispatch()
  const l = useSelector(state => state.profile.language)

  const amountRef = useRef(null)
  const typeRef = useRef(null)
  const indexRef = useRef(null)
  const descriptionRef = useRef(null)

  const defaultFormValue = {
    isIncome: false,
    amount: '',
    type: null,
    index: null,
    description: ''
  }

  const [formValue, setFormValue] = useState(defaultFormValue)

  const clearForm = () => {
    setFormValue(defaultFormValue)
    amountRef.current.setFocus()
  }

  const handleChange = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.amount === '') err += L("What's the amount? ", l)
    else if (Number(formValue.amount) <= 0)
      err += L("Positive amount only please. ", l)
    if (formValue.type === null) err += L("Please select a type. ", l)
    else if (formValue.index === null) err += L("Please select a day. ", l)
    if (formValue.description === '') err += L("What did you use this for? ", l)

    if (err !== "") {
      dispatch(showToast(err))
      return false
    }
    else {
      let amount = Number(formValue.amount)
      if (!formValue.isIncome) {
        amount = -amount
      }
      dispatch(addSchedule({
        amount: amount,
        currency: currency,
        type: formValue.type,
        index: formValue.index,
        description: formValue.description
      }, data, schedules))
      clearForm()
      dispatch(showToast(L("Schedule added.", l)))
      return true
    }
  }

  return <FormModalContainer
    title="Create Schedule"
    className="schedule-modal"
    clearHandler={clearForm}
    submitHandler={handleSubmit}
  >
    <IonContent color="light">

      <BooleanInput
        falseLabel="Payment"
        trueLabel="Income"
        checked={formValue.isIncome}
        onChange={e => handleChange("isIncome", e.detail.checked)}
      />

      <AmountInput
        value={formValue.amount}
        compRef={amountRef}
        onKeyPress={e => {
          if (e.key === "Enter") typeRef.current.open()
        }}
        onChange={e => handleChange("amount", e.detail.value)}
      />

      <SelectInput
        label="Type"
        value={formValue.type}
        compRef={typeRef}
        onChange={e => {
          handleChange("type", e.detail.value)
          if (e.detail.value !== null) indexRef.current.open()
        }}
        options={types}
        cancelText="Select Monthly or Weekly"
        placeholder="Monthly or Weekly"
      />

      {formValue.type !== null
        ? <SelectInput
          label="Day/Date"
          value={formValue.index}
          compRef={indexRef}
          onChange={e => {
            handleChange("index", e.detail.value)
            if (e.detail.value !== null) descriptionRef.current.setFocus()
          }}
          options={formValue.type === "Monthly"
            ? monthlyIndices : weeklyIndices}
          cancelText="Select the day/date"
          placeholder="When"
        />
        : null}

      <DescriptionInput
        value={formValue.description}
        compRef={descriptionRef}
        onKeyPress={e => {
          if (e.key === "Enter") handleSubmit()
        }}
        onChange={e => handleChange("description", e.detail.value)}
      />

    </IonContent>
  </FormModalContainer>
}

export default ScheduleForm