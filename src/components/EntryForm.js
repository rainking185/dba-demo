import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonToast, IonFab, IonFabButton, IonIcon, IonToolbar,
  IonButton, IonItem, IonLabel, IonToggle, IonInput, IonModal, IonContent
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { addEntry } from '../features/profile'

const EntryForm = () => {

  const currency = useSelector(state => state.app.currency)
  const journal = useSelector(state => state.profile.journal)
  const data = useSelector(state => state.profile.data)
  const dispatch = useDispatch()

  const defaultFormValue = {
    isEarning: false,
    amount: '',
    description: ''
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

  const clearForm = () => {
    setFormValue({
      ...formValue,
      amount: ''
    })
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.amount === '') err += "How much did you spend? "
    else if (Number(formValue.amount) <= 0) err += "Positive amount only please. "
    if (formValue.description === '') err += "What did you use this for? "

    if (err !== "") setToast({ shown: true, message: err })
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
      clearForm()
      setToast({ shown: true, message: "Entry added." })
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
            Spending
            <IonToggle checked={formValue.isEarning} onIonChange={e => handleChange("isEarning", e.detail.checked)} />
            Earning
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Amount</IonLabel>
            <IonInput type="number" value={formValue.amount} placeholder="How Much" onIonChange={e => handleChange("amount", e.detail.value)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonInput value={formValue.description} placeholder="For What" onIonChange={e => handleChange("description", e.detail.value)} autoCorrect={true} />
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

export default EntryForm