import React from 'react'
import {
  IonPage, IonText, IonContent,
  IonItemDivider, IonLabel, IonItem, IonCol, IonButtons
} from '@ionic/react';
import EntryForm from '../components/EntryForm'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import "./Styles.css"
import BudgetForm from '../components/BudgetForm';
import { getAllowance, budgetGauge, currencyFilter } from '../features/profile/utils';

const Summary = () => {

  const currency = useSelector(state => state.app.currency)
  const summary = useSelector(
    state => state.profile.data.currencies[currency]
  )
  const income = currencyFilter(useSelector(
    state => state.profile.income
  ), currency)
  const {
    remainingToday = 0,
    remainingMonth = 0,
    savings = 0,
    budgetMonth = 0,
    budgetToday = 0,
    monthlyIncome = 0,
    remainingIncome = 0,
    imEarning = false,
    dailyBudget = 0
  } = summary

  const allowance = getAllowance(savings)

  const selectColor = (number) => {
    if (number === 0) return "medium"
    else if (number < 0) return "danger"
    else return undefined
  }

  const selectBudgetColor = budget => {
    if (!imEarning) return undefined
    const budgetRef = budgetGauge(income)
    if (budget > budgetRef) return "danger"
    else return undefined
  }

  let warningColor = "light"
  let warningMessage = ""

  if (imEarning) {
    if (remainingIncome + savings <= 0 || remainingIncome <= 0) {
      warningColor = "danger"
      warningMessage = "Go and earn some money. This page is useless now."
    } else if (savings <= 0) {
      warningColor = "warning"
      warningMessage = "You are spending way ahead of budget. Please control your spending."
    } else {
      let days = Math.floor(remainingIncome / dailyBudget)
      if (days <= 7) {
        warningColor = "warning"
        warningMessage = "You are running out of budget."
      }
    }
  }

  return (
    <IonPage color={warningColor}>
      <Header />
      <IonContent color={warningColor}>
        {warningMessage !== ""
          ? <>
            <IonItemDivider color={warningColor === "warning" ? "danger" : "dark"}>
              <IonText>Warning:</IonText>
            </IonItemDivider>
            <IonItem color={warningColor === "warning" ? "danger" : "dark"}>
              <IonText>{warningMessage}</IonText>
            </IonItem>
          </>
          : null}
        <IonItemDivider color={warningColor} >
          <IonLabel>Today</IonLabel>
        </IonItemDivider>
        <IonItem color={warningColor} class="ion-text-center">
          <IonLabel>
            <IonText class="xx-large" color={selectColor(remainingToday)}>
              {remainingToday.toFixed(2)}
            </IonText>
            <IonText class="small">
              {" "}/
            </IonText>
            <IonText class="small" color={selectBudgetColor(budgetToday)}>
              {budgetToday.toFixed(2)}
            </IonText>
          </IonLabel>
          <IonButtons slot="end">
            <BudgetForm />
          </IonButtons>
        </IonItem>
        <IonItemDivider color={warningColor}>
          <IonLabel>This Month</IonLabel>
        </IonItemDivider>
        <IonItem color={warningColor} class="ion-text-center">
          <IonLabel>
            <IonText class="x-large" color={selectColor(remainingMonth)}>
              {remainingMonth.toFixed()}
            </IonText>
            <IonText color={selectColor(budgetMonth)}>
              {" "}/{budgetMonth.toFixed()}
            </IonText>
          </IonLabel>
        </IonItem>
        <IonItemDivider color={warningColor}>
          <IonLabel>Overall</IonLabel>
        </IonItemDivider>
        <IonItem color={warningColor}>
          <IonCol>Savings:</IonCol>
          <IonCol class="ion-text-right">
            <IonText color={selectColor(savings)}>
              {savings.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>
        <IonItem color={warningColor}>
          <IonCol>
            Monthly {monthlyIncome > 0 ? "Income" : "Payment"}:
          </IonCol>
          <IonCol class="ion-text-right">
            {Math.abs(monthlyIncome).toFixed(2)}
          </IonCol>
        </IonItem>
        <IonItem color={warningColor}>
          <IonCol>Allowance:</IonCol>
          <IonCol class="ion-text-right">
            <IonText color={selectColor(allowance)}>
              {allowance.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>

      </IonContent>
      <EntryForm currency={currency} />
    </IonPage>
  )
}

export default Summary
