import React, { useState, useRef } from 'react'
import {
  IonPage, IonItemGroup, IonPopover, IonText, IonIcon, IonInput, IonContent,
  IonItemDivider, IonLabel, IonItem, IonButton, IonCol, IonCard
} from '@ionic/react';
import EntryForm from '../components/EntryForm'
import Header from '../components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { create } from "ionicons/icons"
import { changeDailyBudget } from "../features/profile"
import "./Styles.css"
import { showToast } from '../features/app';

const Summary = () => {
  const pageRef = useRef()
  const currency = useSelector(state => state.app.currency)
  const data = useSelector(state => state.profile.data)
  const summary = useSelector(
    state => state.profile.data.profile.currencies[currency]
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
  const dispatch = useDispatch()

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
    <IonPage ref={pageRef}>
      <Header pageRef={pageRef} />
      <IonContent>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Today</IonLabel>
          </IonItemDivider>
          <IonItem class="ion-text-center">
            <IonLabel>
              <IonText class="xx-large" color={selectColor(remainingToday)}>
                {remainingToday.toFixed(2)}
              </IonText>
              <IonText class="small" color={selectColor(budgetToday)}>
                {" "}/{budgetToday.toFixed(2)}
              </IonText>
            </IonLabel>
            <IonButton slot="end" onClick={() => setShowPopover(true)}>
              <IonIcon icon={create} />
            </IonButton>
          </IonItem>
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>This Month</IonLabel>
          </IonItemDivider>
          <IonItem class="ion-text-center">
            <IonLabel>
              <IonText class="x-large" color={selectColor(remainingMonth)}>
                {remainingMonth.toFixed()}
              </IonText>
              <IonText color={selectColor(budgetMonth)}>
                {" "}/{budgetMonth.toFixed()}
              </IonText>
            </IonLabel>
          </IonItem>
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Overall</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonCol>Savings:</IonCol>
            <IonCol class="ion-text-right">
              <IonText color={selectColor(savings)}>
                {savings.toFixed(2)}
              </IonText>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol>
              Monthly {monthlyIncome >= 0 ? "Income" : "Payment"}:
            </IonCol>
            <IonCol class="ion-text-right">
              {monthlyIncome < 0
                ? (-monthlyIncome).toFixed(2)
                : monthlyIncome.toFixed(2)}
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol>Allowance:</IonCol>
            <IonCol class="ion-text-right">
              <IonText color={selectColor(allowance)}>
                {allowance.toFixed(2)}
              </IonText>
            </IonCol>
          </IonItem>
        </IonItemGroup>
      </IonContent>
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={e => setShowPopover(false)}
        class="popover">
        <IonCard>
          <IonItem>
            <IonItem>
              <IonLabel position="floating">Daily Budget</IonLabel>
              <IonInput
                value={dailyBudget}
                placeholder="Set your daily budget."
                onIonChange={e => setDailyBudget(e.detail.value)} />
            </IonItem>
            <IonButton slot="end" onClick={handleClick}>SAVE</IonButton>
          </IonItem>
        </IonCard>
      </IonPopover>
      <EntryForm currency={currency} />
    </IonPage>
  )
}

export default Summary
