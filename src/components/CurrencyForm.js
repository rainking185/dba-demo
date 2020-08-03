import React, { useState, useRef } from 'react'
import {
  IonFab, IonFabButton, IonIcon, IonToolbar,
  IonButton, IonItem, IonInput, IonModal,
  IonContent, IonLabel, IonTitle
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { useSelector, useDispatch } from 'react-redux'
import { addCurrency } from '../features/profile'
import { showToast } from '../features/app'
import { areLetters } from '../utils/regex'
import { L } from '../utils/language'

const CurrencyForm = () => {
  const data = useSelector(state => state.profile.data)
  const journal = useSelector(state => state.profile.journal)
  const dispatch = useDispatch()
  const showAd = useSelector(state => state.app.showAd)
  const l = useSelector(state => state.profile.language)

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

    if (err !== "") dispatch(showToast(err))
    else {
      let currency = formValue.currency.toUpperCase()
      dispatch(addCurrency({
        currency: currency,
        dailyBudget: Number(formValue.dailyBudget),
        savings: Number(formValue.savings)
      }, data, journal))
      clearForm()
      dispatch(showToast(L("New currency added.", l)))
      setShown(false)
    }
  }

  const Fab = () => {
    return (
      <IonFab
        slot="fixed"
        class={showAd ? "fab" : undefined}
        vertical="bottom"
        horizontal="end"
      >
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
            {L("CLEAR", l)}
          </IonButton>
          <IonTitle>
            {L("Create Currency", l)}
          </IonTitle>
          <IonButton
            class="ion-padding-end"
            slot="end"
            onClick={handleSubmit}>
            {L("ADD", l)}
          </IonButton>
        </IonToolbar>

        <IonContent color="light">
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Currency", l)}</IonLabel>
            <IonInput
              type="text"
              maxlength={3}
              minlength={3}
              value={formValue.currency}
              ref={currencyRef}
              onKeyPress={e => {
                if (e.key === "Enter") savingsRef.current.setFocus()
              }}
              onIonChange={e => handleChange("currency", e.detail.value)} />
          </IonItem>
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Savings", l)}</IonLabel>
            <IonInput
              type="number"
              value={formValue.savings}
              placeholder={L("Savings to Start", l)}
              ref={savingsRef}
              onKeyPress={e => {
                if (e.key === "Enter") budgetRef.current.setFocus()
              }}
              onIonChange={e => handleChange("savings", e.detail.value)} />
          </IonItem>
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Daily Budget", l)}</IonLabel>
            <IonInput
              type="number"
              value={formValue.dailyBudget}
              placeholder={L("Daily Budget", l)}
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