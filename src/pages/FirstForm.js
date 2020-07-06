import React, { useState } from 'react'
import {
  IonToast, IonToolbar,
  IonButton, IonButtons, IonItem, IonInput,
  IonContent, IonLabel,
  IonPage,
  IonTitle
} from '@ionic/react'
import { initProfile } from "../features/profile"
import { setCurrency } from "../features/app"
import { useDispatch } from "react-redux"
const FirstForm = (props) => {

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
    if (formValue.currency === null) err += "What is the new currency? "
    else if (formValue.currency.length !== 3) err += "Currency with 3 letters only. "
    if (formValue.savings === '') err += "Please add your savings. "
    if (formValue.dailyBudget === '') err += "Please set your daily budget."
    else if (Number(formValue.dailyBudget) < 0) err += "Daily budget cannot be negative."

    if (err !== "") setToast({ shown: true, message: err })
    else {
      dispatch(setCurrency(formValue.currency.toUpperCase()))
      dispatch(initProfile({
        currency: formValue.currency,
        savings: Number(formValue.savings),
        dailyBudget: Number(formValue.dailyBudget)
      }))
    }
  }

  return (
    <IonPage>
      <IonContent>
        <IonToolbar color="primary">
          <IonTitle>Welcome to DBA!</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit}>Start DBA</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonItem>
          <IonLabel position="floating">Currency</IonLabel>
          <IonInput
            type="text"
            maxlength={3}
            minlength={3}
            onIonChange={e => handleChange("currency", e.detail.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Savings</IonLabel>
          <IonInput type="number" value={formValue.savings} placeholder="Savings to Start" onIonChange={e => handleChange("savings", e.detail.value)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Daily Budget</IonLabel>
          <IonInput type="number" value={formValue.dailyBudget} placeholder="Daily Budget" onIonChange={e => handleChange("dailyBudget", e.detail.value)}></IonInput>
        </IonItem>
      </IonContent>
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast({ shown: false, message: "" })}
        message={toast.message}
        duration={1000}
      />
    </IonPage>
  )
}

export default FirstForm