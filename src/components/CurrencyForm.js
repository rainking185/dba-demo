import React, { useState, useRef } from 'react'
import {
  IonFab, IonFabButton, IonIcon, IonToolbar,
  IonButton, IonItem, IonInput, IonModal,
  IonContent, IonLabel
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { useSelector, useDispatch } from 'react-redux'
import { addCurrency } from '../features/profile'
import { showToast } from '../features/app'
import { areLetters } from '../utils/regex'

const CurrencyForm = () => {
  const data = useSelector(state => state.profile.data)
  const journal = useSelector(state => state.profile.journal)
  const dispatch = useDispatch()

  const currencyRef = useRef(null)
  const savingsRef = useRef(null)
  const budgetRef = useRef(null)

  const defaultFormValue = {
    currency: null,
    savings: '',
    dailyBudget: ''
  }
  const [formValue, setFormValue] = useState(defaultFormValue)

  const [shown, setShown] = useState(false);

  const handleChange = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const clearForm = () => {
    setFormValue(defaultFormValue)
    currencyRef.current.setFocus()
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.currency === null) err += "What is the new currency? "
    else if (formValue.currency.length !== 3
      || !areLetters(formValue.currency))
      err += "Currency with 3 letters only. "
    else if (Object.keys(data.profile.currencies).includes(formValue.currency))
      err += "You already have this currency. "
    if (formValue.savings === '') err += "Please add your savings. "
    if (formValue.dailyBudget === '') err += "Please set your daily budget. "
    else if (Number(formValue.dailyBudget) < 0)
      err += "Daily budget cannot be negative. "

    if (err !== "") dispatch(showToast(err))
    else {
      let currency = formValue.currency.toUpperCase()
      dispatch(addCurrency({
        currency: currency,
        dailyBudget: Number(formValue.dailyBudget),
        savings: Number(formValue.savings)
      }, data, journal))
      clearForm()
      dispatch(showToast("New currency added."))
      setShown(false)
    }
  }

  const Fab = () => {
    return (
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShown(!shown)}>
          <IonIcon icon={shown ? close : add} />
        </IonFabButton>
      </IonFab>
    )
  }


  return (
    <>
      <Fab />
      <IonModal
        isOpen={shown}
        onDidDismiss={() => setShown(false)}
        class="default-modal">
        <Fab />
        <IonToolbar color="medium">
          <IonButton
            class="ion-padding-start"
            slot="start"
            onClick={clearForm}>
            CLEAR
            </IonButton>
          <IonButton
            class="ion-padding-end"
            slot="end"
            onClick={handleSubmit}>
            ADD
            </IonButton>
        </IonToolbar>

        <IonContent color="light">
          <IonItem color="inherit">
            <IonLabel position="floating">Currency</IonLabel>
            <IonInput
              type="text"
              maxlength={3}
              minlength={3}
              autofocus
              value={formValue.currency}
              ref={currencyRef}
              onKeyPress={e => {
                if (e.key === "Enter") savingsRef.current.setFocus()
              }}
              onIonChange={e => handleChange("currency", e.detail.value)} />
          </IonItem>
          <IonItem color="inherit">
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
          <IonItem color="inherit">
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
      </IonModal>
    </>
  )
}

export default CurrencyForm