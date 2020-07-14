import React, { useState, useRef, useEffect } from 'react'
import {
  IonToolbar, IonButton, IonButtons, IonItem, IonInput,
  IonContent, IonLabel, IonPage, IonTitle, IonIcon, IonModal, IonHeader
} from '@ionic/react'
import { initProfile } from "../features/profile"
import { setCurrency, showToast } from "../features/app"
import { useDispatch } from "react-redux"
import { informationCircle } from 'ionicons/icons'
import Help from './Help'
import { Plugins } from "@capacitor/core"
import { areLetters } from '../utils/regex'

const { Keyboard } = Plugins

const FirstForm = () => {

  const dispatch = useDispatch()

  const savingsRef = useRef(null)
  const budgetRef = useRef(null)

  const [shown, setShown] = useState(false) // For the help page displayed in Modal

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

  useEffect(() => { Keyboard.show() }, []);

  const handleSubmit = () => {
    let err = ""
    if (formValue.currency === null) err += "What is the new currency? "
    else if (formValue.currency.length !== 3 || !areLetters(formValue.currency))
      err += "Currency with 3 letters only. "
    if (formValue.savings === '') err += "Please add your savings. "
    if (formValue.dailyBudget === '') err += "Please set your daily budget."
    else if (Number(formValue.dailyBudget) < 0)
      err += "Daily budget cannot be negative."

    if (err !== "") dispatch(showToast(err))
    else {
      dispatch(setCurrency(formValue.currency.toUpperCase()))
      dispatch(initProfile({
        currency: formValue.currency.toUpperCase(),
        savings: Number(formValue.savings),
        dailyBudget: Number(formValue.dailyBudget)
      }))
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => setShown(true)}>
              <IonIcon slot="icon-only" icon={informationCircle} />
            </IonButton>
          </IonButtons>
          <IonTitle>Welcome to DBA!</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit}>Start DBA</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonItem color="light">
          <IonLabel position="floating">Currency</IonLabel>
          <IonInput
            type="text"
            maxlength={3}
            minlength={3}
            autofocus
            value={formValue.currency}
            onKeyPress={e => {
              console.log(e.key)
              if (e.key === "Enter") savingsRef.current.setFocus()
            }}
            onIonChange={e => handleChange("currency", e.detail.value)} />
        </IonItem>
        <IonItem color="light">
          <IonLabel position="floating">Savings</IonLabel>
          <IonInput
            type="number"
            value={formValue.savings}
            placeholder="Savings to Start"
            ref={savingsRef}
            onKeyPress={e => {
              if (e.key === "Enter") budgetRef.current.setFocus()
            }}
            onIonChange={e => handleChange("savings", e.detail.value)} />
        </IonItem>
        <IonItem color="light">
          <IonLabel position="floating">Daily Budget</IonLabel>
          <IonInput
            type="number"
            value={formValue.dailyBudget}
            placeholder="Daily Budget"
            ref={budgetRef}
            onKeyPress={e => {
              if (e.key === "Enter") handleSubmit()
            }}
            onIonChange={e => handleChange("dailyBudget", e.detail.value)} />
        </IonItem>
      </IonContent>
      <IonModal
        isOpen={shown}
        onDidDismiss={() => setShown(false)}>
        <Help closeHandler={() => setShown(false)} />
      </IonModal>
    </IonPage>
  )
}

export default FirstForm