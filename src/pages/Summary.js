import React, { useState } from 'react'
import {
  IonPage, IonPopover, IonText, IonIcon, IonInput, IonContent,
  IonItemDivider, IonLabel, IonItem, IonButton, IonCol, IonCard, IonButtons
} from '@ionic/react';
import EntryForm from '../components/EntryForm'
import Header from '../components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { create } from "ionicons/icons"
import { changeDailyBudget } from "../features/profile"
import "./Styles.css"
import { showToast } from '../features/app';

const Summary = () => {

  const dispatch = useDispatch()
  const currency = useSelector(state => state.app.currency)
  const data = useSelector(state => state.profile.data)
  const summary = useSelector(
    state => state.profile.data.currencies[currency]
  )
  const {
    remainingToday = 0,
    remainingMonth = 0,
    savings = 0,
    budgetMonth = 0,
    budgetToday = 0,
    allowance = 0,
    monthlyIncome = 0
  } = summary
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

  const selectColor = (number) => {
    if (number === 0) return "medium"
    else if (number < 0) return "danger"
    else return undefined
  }

  return (
    <IonPage color="light">
      <Header />
      <IonContent color="light">
        <IonItemDivider color="light" >
          <IonLabel>Today</IonLabel>
        </IonItemDivider>
        <IonItem color="light" class="ion-text-center">
          <IonLabel>
            <IonText class="xx-large" color={selectColor(remainingToday)}>
              {remainingToday.toFixed(2)}
            </IonText>
            <IonText class="small" color={selectColor(budgetToday)}>
              {" "}/{budgetToday.toFixed(2)}
            </IonText>
          </IonLabel>
          <IonButtons slot="end">
            <IonButton onClick={() => {
              setDailyBudget(summary.dailyBudget)
              setShowPopover(true)
            }}>
              <IonIcon slot="icon-only" icon={create} color="primary" />
            </IonButton>
          </IonButtons>
        </IonItem>
        <IonItemDivider color="light">
          <IonLabel>This Month</IonLabel>
        </IonItemDivider>
        <IonItem color="light" class="ion-text-center">
          <IonLabel>
            <IonText class="x-large" color={selectColor(remainingMonth)}>
              {remainingMonth.toFixed()}
            </IonText>
            <IonText color={selectColor(budgetMonth)}>
              {" "}/{budgetMonth.toFixed()}
            </IonText>
          </IonLabel>
        </IonItem>
        <IonItemDivider color="light">
          <IonLabel>Overall</IonLabel>
        </IonItemDivider>
        <IonItem color="light">
          <IonCol>Savings:</IonCol>
          <IonCol class="ion-text-right">
            <IonText color={selectColor(savings)}>
              {savings.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>
        <IonItem color="light">
          <IonCol>
            Monthly {monthlyIncome > 0 ? "Income" : "Payment"}:
          </IonCol>
          <IonCol class="ion-text-right">
            {monthlyIncome < 0
              ? (-monthlyIncome).toFixed(2)
              : monthlyIncome.toFixed(2)}
          </IonCol>
        </IonItem>
        <IonItem color="light">
          <IonCol>Allowance:</IonCol>
          <IonCol class="ion-text-right">
            <IonText color={selectColor(allowance)}>
              {allowance.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>
      </IonContent>
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={e => setShowPopover(false)}
        class="popover">
        <IonCard>
          <IonItem>
            <IonLabel position="floating">Daily Budget</IonLabel>
            <IonInput
              value={dailyBudget}
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
      <EntryForm currency={currency} />
    </IonPage>
  )
}

export default Summary
