import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonFab, IonFabButton, IonIcon, IonToolbar,
  IonButton, IonItem, IonLabel, IonToggle, IonInput, IonModal, IonContent, IonTitle, IonChip
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { addFamilyEntry } from '../features/profile'
import { showToast } from '../features/app'
import { getDescriptions } from '../features/profile/utils'
import { L } from '../utils/language'

const FamilyEntryForm = () => {

  const currency = useSelector(state => state.app.currency)
  const journal = useSelector(state => state.profile.family.journal)
  const data = useSelector(state => state.profile.family.data)
  const dispatch = useDispatch()
  const descriptions = getDescriptions(journal)
  const l = useSelector(state => state.profile.language)
  const showAd = useSelector(state => state.app.showAd)

  const amountRef = useRef(null)
  const descriptionRef = useRef(null)

  const defaultFormValue = {
    isIncome: false,
    amount: '',
    description: ''
  }

  const [formValue, setFormValue] = useState(defaultFormValue)

  const [shown, setShown] = useState(false);

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

    if (err !== "") dispatch(showToast(err))
    else {
      let amount = Number(formValue.amount)
      if (!formValue.isIncome) {
        amount = -amount
      }
      dispatch(addFamilyEntry({
        isIncome: formValue.isIncome,
        currency: currency,
        amount: amount,
        description: formValue.description
      }, data, journal))
      clearAmount()
      dispatch(showToast(L("Entry added.", l)))
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
        class="entry-modal">
        <Fab />
        <IonToolbar color="medium">
          <IonButton
            class="ion-padding-start"
            slot="start"
            onClick={clearForm}>
            {L("CLEAR", l)}
          </IonButton>
          <IonTitle>{L("Log Entry", l)}</IonTitle>
          <IonButton
            class="ion-padding-end"
            slot="end"
            onClick={handleSubmit}>
            {L("ADD", l)}
          </IonButton>
        </IonToolbar>

        <IonContent color="light">
          <IonItem color="inherit">
            {L("Spending", l)}
            <IonToggle
              checked={formValue.isIncome}
              onIonChange={e => handleChange("isIncome", e.detail.checked)} />
            {L("Income", l)}
          </IonItem>
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Amount", l)}</IonLabel>
            <IonInput
              ref={amountRef}
              type="number"
              value={formValue.amount}
              placeholder={L("How Much", l)}
              onKeyPress={e => {
                if (e.key === "Enter") descriptionRef.current.setFocus()
              }}
              onIonChange={e => handleChange("amount", e.detail.value)} />
          </IonItem>
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Description", l)}</IonLabel>
            <IonInput
              ref={descriptionRef}
              value={formValue.description}
              autocapitalize
              clearInput
              placeholder={L("For What", l)}
              onKeyPress={e => {
                if (e.key === "Enter") handleSubmit()
              }}
              onIonChange={e => handleChange("description", e.detail.value)}
              autoCorrect={true} />
          </IonItem>
          <p>
            {descriptions.map((description) => {
              return <IonChip key={description} onClick={() => setFormValue({
                ...formValue,
                description: description
              })}>
                <IonLabel>{description}</IonLabel>
              </IonChip>
            })}
          </p>
        </IonContent>
      </IonModal>
    </>
  )
}

export default FamilyEntryForm