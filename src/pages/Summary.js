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
import { L } from '../utils/language'

const Summary = () => {

  const currency = useSelector(state => state.app.currency)
  const summary = useSelector(
    state => state.profile.data.currencies[currency]
  )
  const income = currencyFilter(useSelector(
    state => state.profile.income
  ), currency)
  const l = useSelector(state => state.profile.language)
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
      warningMessage = L("Go and earn some money. This page is useless now.", l)
    } else if (savings <= 0) {
      warningColor = "warning"
      warningMessage = L("You are spending way ahead of budget. Please control your spending.", l)
    } else {
      let days = Math.floor(remainingIncome / dailyBudget)
      if (days <= 7) {
        warningColor = "warning"
        warningMessage = L("You are running out of budget.", l)
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
              <IonText>{L("Warning", l)}:</IonText>
            </IonItemDivider>
            <IonItem color={warningColor === "warning" ? "danger" : "dark"}>
              <IonText>{warningMessage}</IonText>
            </IonItem>
          </>
          : null}
        <IonItemDivider color={warningColor} >
          <IonLabel>{L("Today", l)}</IonLabel>
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
          <IonLabel>{L("This Month", l)}</IonLabel>
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
          <IonLabel>{L("Overall", l)}</IonLabel>
        </IonItemDivider>
        <IonItem color={warningColor}>
          <IonCol>{L("Savings", l)}:</IonCol>
          <IonCol class="ion-text-right">
            <IonText color={selectColor(savings)}>
              {savings.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>
        <IonItem color={warningColor}>
          <IonCol>
            {L("Monthly", l)} {monthlyIncome > 0 ? L("Income", l) : L("Payment", l)}:
          </IonCol>
          <IonCol class="ion-text-right">
            {Math.abs(monthlyIncome).toFixed(2)}
          </IonCol>
        </IonItem>
        <IonItem color={warningColor}>
          <IonCol>{L("Allowance", l)}:</IonCol>
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
