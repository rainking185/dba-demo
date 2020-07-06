import React, { useState } from 'react'
import {
  IonToast, IonToolbar, IonSelect,
  IonButton, IonButtons, IonItem, IonInput,
  IonSelectOption
} from '@ionic/react'
import { initProfile } from "../features/profile"
import { setCurrency } from "../features/navigation"
import { useDispatch } from "react-redux"
const FirstForm = (props) => {
  const {
    currencyList = ['CNY', 'AUD', 'JPY', 'SGD']
  } = props

  const defaultFormValue = {
    currency: null,
    savings: '',
    dailyBudget: ''
  }
  const dispatch = useDispatch()

  const [formValue, setFormValue] = useState(defaultFormValue)

  const [toast, setToast] = useState({
    shown: false,
    message: ""
  });

  const handleChange = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.currency === null) err += "Please select currency. "
    if (formValue.savings === '') err += "Please add your savings. "
    if (formValue.dailyBudget === '') err += "Please set your daily budget."
    else if (Number(formValue.dailyBudget) < 0) err += "Daily budget cannot be negative."

    if (err !== "") setToast({ shown: true, message: err })
    else {
      dispatch(setCurrency(formValue.currency))
      dispatch(initProfile({
        currency: formValue.currency,
        savings: Number(formValue.savings),
        dailyBudget: Number(formValue.dailyBudget)
      }))
    }
  }

  return (
    <>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={handleSubmit}>Start DBA</IonButton>
        </IonButtons>
      </IonToolbar>
      <IonItem>
        <IonSelect
          name="currency"
          value={formValue.currency}
          placeholder="Select New Currency"
          onIonChange={e => handleChange("currency", e.detail.value)}
        >
          {currencyList.map((currency, index) =>
            <IonSelectOption key={index} value={currency}>
              {currency}
            </IonSelectOption>
          )}
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonInput type="number" value={formValue.savings} placeholder="Savings to Start" onIonChange={e => handleChange("savings", e.detail.value)}></IonInput>
      </IonItem>
      <IonItem>
        <IonInput type="number" value={formValue.dailyBudget} placeholder="Daily Budget" onIonChange={e => handleChange("dailyBudget", e.detail.value)}></IonInput>
      </IonItem>
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast({ shown: false, message: "" })}
        message={toast.message}
        duration={1000}
      />
    </>
  )
}

export default FirstForm