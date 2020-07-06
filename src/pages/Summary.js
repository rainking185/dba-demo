import React, { useState } from 'react'
import {
  IonPage, IonItemGroup, IonPopover, IonToast, IonText,
  IonItemDivider, IonLabel, IonItem, IonButton, IonIcon, IonInput, IonContent, IonCol
} from '@ionic/react';
import EntryForm from '../components/EntryForm'
import Header from '../components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { create } from "ionicons/icons"
import { changDailyBudget } from "../features/profile"
import "./Styles.css"

const Summary = () => {
  const currency = useSelector(state => state.navigation.currency)
  const data = useSelector(state => state.profile.data)
  const summary = useSelector(state => state.profile.data.profile.currencies[currency])
  const {
    remainingToday,
    remainingMonth,
    savings,
    budgetMonth,
    budgetToday,
    allowance,
    monthlyIncome
  } = summary
  const [showPopover, setShowPopover] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(summary.dailyBudget);
  const dispatch = useDispatch()
  const [toast, setToast] = useState({
    shown: false,
    message: ""
  });

  const changeDailyBudget = () => {
    let err = ""
    if (dailyBudget === "") err += "Please enter your daily budget. "
    else if (Number(dailyBudget) < 0) err += "Daily budget cannot be negative. "

    if (err !== "") setToast({ shown: true, message: err })
    else {
      let newBudget = Number(dailyBudget)
      dispatch(changDailyBudget({
        currency: currency,
        amount: newBudget
      }, data))
      setToast({ shown: true, message: "New budget will start tomorrow." })
      setShowPopover(false)
    }
  }

  const selectColor = (number) => {
    if (number === 0) return "medium"
    else if (number < 0) return "danger"
    else return undefined
  }

  return (
    <IonPage>
      <IonContent>
        <Header />
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Today</IonLabel>
          </IonItemDivider>
          <IonItem class="ion-text-center">
            <IonLabel>
              <IonText class="xx-large" color={selectColor(remainingToday)}>
                {remainingToday.toFixed(2)}
              </IonText>
              <IonText color={selectColor(remainingToday)}>
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
              <IonText class="small">
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
              {monthlyIncome < 0 ? (-monthlyIncome).toFixed(2) : monthlyIncome.toFixed(2)}
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
      >
        <IonItem>
          <IonItem>
            <IonLabel position="floating">Daily Budget</IonLabel>
            <IonInput
              value={dailyBudget}
              placeholder="Set your daily budget."
              onIonChange={e => setDailyBudget(e.detail.value)}
            />
          </IonItem>
          <IonButton slot="end" onClick={changeDailyBudget}>SAVE</IonButton>
        </IonItem>
      </IonPopover>
      <EntryForm currency={currency} />
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast({ shown: false, message: "" })}
        message={toast.message}
        duration={1000}
      />
    </IonPage>
  )
}

export default Summary
