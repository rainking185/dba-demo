import React, { useState } from 'react'
import {
  IonFab, IonFabButton, IonIcon, IonToolbar, IonSelect,
  IonButton, IonItem, IonInput, IonModal, IonLabel,
  IonSelectOption, IonToggle, IonContent
} from '@ionic/react'
import { add, close } from 'ionicons/icons'
import { addSchedule } from '../features/profile'
import { useSelector, useDispatch } from 'react-redux'
import { showToast } from '../features/app'

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

  const defaultFormValue = {
    isIncome: false,
    amount: '',
    type: null,
    index: null,
    description: ''
  }

  const [formValue, setFormValue] = useState(defaultFormValue)

  const [shown, setShown] = useState(false);

  const clearForm = () => setFormValue(defaultFormValue)

  const handleChange = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const handleSubmit = () => {
    let err = ""
    if (formValue.amount === '') err += "Please select currency. "
    else if (Number(formValue.amount) <= 0)
      err += "Positive amount only please. "
    if (formValue.type === null) err += "Please select a type. "
    else if (formValue.index === null) err += "Please select a day. "
    if (formValue.description === '') err += "What did you use this for? "

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
      dispatch(showToast("Schedule added."))
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
        class="schedule-modal">
        <Fab />
        <IonContent>
          <IonToolbar>
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
          <IonItem>
            Payment
            <IonToggle
              checked={formValue.isIncome}
              onIonChange={e => handleChange("isIncome", e.detail.checked)} />
            Income
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Amount</IonLabel>
            <IonInput
              type="number"
              value={formValue.amount}
              placeholder="How Much"
              onIonChange={e => handleChange("amount", e.detail.value)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Type</IonLabel>
            <IonSelect
              interface="action-sheet"
              cancelText="Monthly or Weekly"
              value={formValue.type}
              placeholder="Monthly or Weekly"
              onIonChange={e => handleChange("type", e.detail.value)}>
              {types.map((type, index) =>
                <IonSelectOption key={index} value={type}>
                  {type}
                </IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
          {formValue.type !== null
            ? <IonItem>
              <IonLabel position="floating">Day/Date</IonLabel>
              <IonSelect
                interface="action-sheet"
                cancelText="Select the day/date"
                value={formValue.index}
                placeholder="When"
                onIonChange={e => handleChange("index", e.detail.value)}>
                {formValue.type === "Monthly"
                  ? monthlyIndices.map(index =>
                    <IonSelectOption key={index} value={index}>
                      {index}
                    </IonSelectOption>)
                  : weeklyIndices.map(index =>
                    <IonSelectOption key={index} value={index}>
                      {index}
                    </IonSelectOption>)}
              </IonSelect>
            </IonItem>
            : null}
          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonInput
              value={formValue.description}
              placeholder="For What"
              onIonChange={e => handleChange("description", e.detail.value)} />
          </IonItem>
        </IonContent>
      </IonModal>
    </>
  )
}

export default ScheduleForm