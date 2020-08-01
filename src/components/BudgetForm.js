import React, { useState } from 'react'
import { IonButton, IonIcon, IonPopover, IonCard, IonItem, IonLabel, IonInput, IonButtons, IonCol } from '@ionic/react'
import { create } from 'ionicons/icons'
import { useSelector, useDispatch } from 'react-redux'
import { showToast } from '../features/app'
import { changeDailyBudget } from '../features/profile'
import { budgetGauge, currencyFilter } from '../features/profile/utils'

const BudgetForm = () => {
  const dispatch = useDispatch()
  const currency = useSelector(state => state.app.currency)
  const income = currencyFilter(useSelector(state => state.profile.income), currency)
  const data = useSelector(state => state.profile.data)
  const summary = useSelector(
    state => state.profile.data.currencies[currency]
  )

  const [showPopover, setShowPopover] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(summary.dailyBudget);

  const handleClick = () => {
    let err = ""
    if (dailyBudget === "") err += "Please enter your daily budget. "
    else if (Number(dailyBudget) < 0)
      err += "Daily budget cannot be negative. "

    if (err !== "") dispatch(showToast(err))
    else {
      let newBudget = Number(dailyBudget)
      dispatch(changeDailyBudget({
        currency: currency,
        amount: newBudget
      }, data))
      dispatch(showToast("New budget will start tomorrow."))
      setShowPopover(false)
    }
  }

  const budgetRef = budgetGauge(income)

  return <>
    <IonButton onClick={() => {
      setDailyBudget(summary.dailyBudget)
      setShowPopover(true)
    }}>
      <IonIcon slot="icon-only" icon={create} color="primary" />
    </IonButton>
    <IonPopover
      isOpen={showPopover}
      onDidDismiss={e => setShowPopover(false)}
      class="popover">
      <IonCard>
        {summary.imEarning
          ? <IonItem>
            <IonCol>
              Reference:
            </IonCol>
            <IonCol class="ion-text-right">
              {budgetRef.toFixed()}
            </IonCol>
          </IonItem>
          : null}
        <IonItem>
          <IonLabel position="floating">Daily Budget</IonLabel>
          <IonInput
            value={dailyBudget}
            type="number"
            placeholder="Set your daily budget."
            autofocus
            onIonChange={e => setDailyBudget(e.detail.value)} />
        </IonItem>
        <IonItem>
          <IonButtons slot="end">
            <IonButton onClick={e => setShowPopover(false)}>
              CANCEL
              </IonButton>
            <IonButton onClick={handleClick}>SAVE</IonButton>
          </IonButtons>
        </IonItem>
      </IonCard>
    </IonPopover>
  </>
}

export default BudgetForm