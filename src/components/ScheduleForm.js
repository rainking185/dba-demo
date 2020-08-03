import React, { useState, useRef } from 'react'
import {
  IonFab, IonFabButton, IonIcon, IonToolbar, IonSelect,
  IonButton, IonItem, IonInput, IonModal, IonLabel,
  IonSelectOption, IonToggle, IonContent, IonTitle
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { addSchedule } from '../features/profile'
import { useSelector, useDispatch } from 'react-redux'
import { showToast } from '../features/app'
import { L } from '../utils/language'

const types = ["Monthly", "Weekly"]
const monthlyIndices = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
  '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
  '28'
]
const weeklyIndices = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const ScheduleForm = () => {

  const currency = useSelector(state => state.app.currency)
  const schedules = useSelector(state => state.profile.schedules)
  const data = useSelector(state => state.profile.data)
  const dispatch = useDispatch()
  const l = useSelector(state => state.profile.language)
  const showAd = useSelector(state => state.app.showAd)

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

  const [shown, setShown] = useState(false);

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

    if (err !== "") dispatch(showToast(err))
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
        class="schedule-modal">
        <Fab />
        <IonToolbar color="medium">
          <IonButton
            class="ion-padding-start"
            slot="start"
            onClick={clearForm}>
            {L("CLEAR", l)}
          </IonButton>
          <IonTitle>
            {L("Create Schedule", l)}
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
            {L("Payment", l)}
            <IonToggle
              checked={formValue.isIncome}
              onIonChange={e => handleChange("isIncome", e.detail.checked)} />
            {L("Income", l)}
          </IonItem>
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Amount", l)}</IonLabel>
            <IonInput
              type="number"
              value={formValue.amount}
              ref={amountRef}
              onKeyPress={e => {
                if (e.key === "Enter") typeRef.current.open()
              }}
              placeholder={L("How Much", l)}
              onIonChange={e => handleChange("amount", e.detail.value)} />
          </IonItem>
          <IonItem color="inherit">
            <IonLabel position="floating">{L("Type", l)}</IonLabel>
            <IonSelect
              ref={typeRef}
              interface="action-sheet"
              cancelText={L("Select Monthly or Weekly", l)}
              value={formValue.type}
              placeholder={L("Monthly or Weekly", l)}
              onIonChange={e => {
                handleChange("type", e.detail.value)
                if (e.detail.value !== null) indexRef.current.open()
              }}>
              {types.map((type, index) =>
                <IonSelectOption key={index} value={type}>
                  {L(type, l)}
                </IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
          {formValue.type !== null
            ? <IonItem color="inherit">
              <IonLabel position="floating">{L("Day/Date", l)}</IonLabel>
              <IonSelect
                ref={indexRef}
                interface="action-sheet"
                cancelText={L("Select the day/date", l)}
                value={formValue.index}
                placeholder={L("When", l)}
                onIonChange={e => {
                  handleChange("index", e.detail.value)
                  if (e.detail.value !== null) descriptionRef.current.setFocus()
                }}>
                {formValue.type === "Monthly"
                  ? monthlyIndices.map(index =>
                    <IonSelectOption key={index} value={index}>
                      {index}
                    </IonSelectOption>)
                  : weeklyIndices.map(index =>
                    <IonSelectOption key={index} value={index}>
                      {L(index, l)}
                    </IonSelectOption>)}
              </IonSelect>
            </IonItem>
            : null}
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
              onIonChange={e => handleChange("description", e.detail.value)} />
          </IonItem>
        </IonContent>
      </IonModal>
    </>
  )
}

export default ScheduleForm