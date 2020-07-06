import React, { useState } from 'react'
import {
  IonToast, IonFab, IonFabButton, IonIcon, IonToolbar, IonSelect,
  IonButton, IonItem, IonInput, IonModal,
  IonSelectOption,
  IonContent,
  IonLabel
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { useSelector, useDispatch } from 'react-redux'
import { getUnregisteredCurrencies } from '../features/profile/utils'
import { addCurrency } from '../features/profile'

const CurrencyForm = () => {
  const data = useSelector(state => state.profile.data)
  const journal = useSelector(state => state.profile.journal)
  const currencyList = getUnregisteredCurrencies(data)
  const dispatch = useDispatch()

  const defaultFormValue = {
    currency: null,
    savings: '',
    dailyBudget: ''
  }

  const [formValue, setFormValue] = useState(defaultFormValue)

  const [shown, setShown] = useState(false);

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

  const clearForm = () => setFormValue(defaultFormValue)


  const handleSubmit = () => {
    let err = ""
    if (formValue.currency === null) err += "Please select currency. "
    if (formValue.savings === '') err += "Please add your savings. "
    if (formValue.dailyBudget === '') err += "Please set your daily budget. "
    else if (Number(formValue.dailyBudget) < 0) err += "Daily budget cannot be negative. "

    if (err !== "") setToast({ shown: true, message: err })
    else {
      dispatch(addCurrency({
        currency: formValue.currency,
        dailyBudget: Number(formValue.dailyBudget),
        savings: Number(formValue.savings)
      }, data, journal))
      clearForm()
      setToast({ shown: true, message: "New currency added." })
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
      <IonModal isOpen={shown} onDidDismiss={() => setShown(false)} class="default-modal">
        <Fab />
        <IonContent>
          <IonToolbar>
            <IonButton class="ion-padding-start" slot="start" onClick={clearForm}>CLEAR</IonButton>
            <IonButton class="ion-padding-end" slot="end" onClick={handleSubmit}>ADD</IonButton>
          </IonToolbar>
          <IonItem>
            <IonLabel position="floating">Currency</IonLabel>
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
            <IonLabel position="floating">Savings</IonLabel>
            <IonInput type="number" value={formValue.savings} placeholder="Savings to Start" onIonChange={e => handleChange("savings", e.detail.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Daily Budget</IonLabel>
            <IonInput type="number" value={formValue.dailyBudget} placeholder="Daily Budget" onIonChange={e => handleChange("dailyBudget", e.detail.value)}></IonInput>
          </IonItem>
        </IonContent>
      </IonModal>
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast({ shown: false, message: "" })}
        message={toast.message}
        duration={1000}
      />
    </>
  )
}

export default CurrencyForm