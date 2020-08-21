import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonPage, IonItem, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle,
  IonContent, IonHeader, IonLabel,
  IonText, IonCol, IonCheckbox,
} from '@ionic/react'
import { arrowBack } from "ionicons/icons"

import { showToast } from '../../features/app'
import BudgetForm from '../../common/form/BudgetForm'
import { toggleImEarning, addIncome } from '../../features/profile'
import { budgetGauge, currencyFilter } from '../../features/profile/utils'
import { L } from '../../utils/language'
import FormModalContainer from '../../common/containers/FormModalContainer'
import AmountInput from '../../common/inputs/AmountInput'

const Income = ({ closeHandler }) => {

  const currency = useSelector(state => state.app.currency)
  const fullIncome = useSelector(state => state.profile.income)
  const income = currencyFilter(fullIncome, currency)
  const data = useSelector(state => state.profile.data)
  const summary = useSelector(
    state => state.profile.data.currencies[currency]
  )
  const l = useSelector(state => state.profile.language)

  const {
    dailyBudget,
    remainingIncome = 0,
    totalIncome = 0,
    imEarning = false
  } = summary
  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')

  const handleSubmit = () => {
    let err = ""
    if (amount === '') err += L("What's the amount? ", l)

    if (err !== "") {
      dispatch(showToast(err))
      return true
    }
    else {
      dispatch(addIncome(
        { amount: Number(amount), currency: currency },
        data, fullIncome
      ))
      dispatch(showToast(L("Income added.", l)))
      setAmount('')
      return true
    }
  }

  const selectBudgetColor = budget => {
    if (!imEarning) return undefined
    const budgetRef = budgetGauge(income)
    if (budget > budgetRef) return "danger"
    else return undefined
  }
  const days = remainingIncome <= 0
    ? 0
    : Math.floor(remainingIncome / dailyBudget)

  const selectDaysColor = number => {
    if (!imEarning) return undefined
    if (number <= 7) return "danger"
    else if (number <= 30) return "warning"
    else return undefined
  }

  return <IonPage>
    <IonHeader>
      <IonToolbar color={imEarning ? "danger" : "tertiary"}>
        <IonButtons slot="start">
          <IonButton onClick={closeHandler}>
            <IonIcon slot="icon-only" icon={arrowBack} />
          </IonButton>
        </IonButtons>
        <IonTitle>{currency} {L("Income", l)}</IonTitle>
        <IonItem slot="end" color={imEarning ? "danger" : "tertiary"}>
          <IonLabel>{L("I'M EARNING", l)}</IonLabel>
          <IonCheckbox
            slot="start"
            checked={imEarning}
            onIonChange={() => dispatch(toggleImEarning(currency))} />
        </IonItem>
      </IonToolbar>
    </IonHeader>

    <IonContent color="light">
      <IonItem color="light">
        <IonCol>{L("Total Income", l)}:</IonCol>
        <IonCol class="ion-text-right">
          <IonText>
            {totalIncome.toFixed(2)}
          </IonText>
        </IonCol>
      </IonItem>
      <IonItem color="light">
        <IonCol>
          {L("Remaining Income", l)}:
          </IonCol>
        <IonCol class="ion-text-right">
          <IonText
            class="x-large"
            color={remainingIncome <= 0 && imEarning ? "danger" : undefined}
          >
            {remainingIncome.toFixed(2)}
          </IonText>
        </IonCol>
      </IonItem>
      <IonItem color="light">
        <IonCol>{L("Daily Budget", l)}:</IonCol>
        <IonCol>
          <IonButtons>
            <BudgetForm />
          </IonButtons>
        </IonCol>
        <IonCol class="ion-text-right">
          <IonText color={selectBudgetColor(dailyBudget)}>
            {dailyBudget}
          </IonText>
        </IonCol>
      </IonItem>
      <IonItem color="light">
        <IonCol>{L("Days Covered", l)}:</IonCol>
        <IonCol class="ion-text-right">
          <IonText class="x-large" color={selectDaysColor(days)}>
            {days}
          </IonText>
        </IonCol>
      </IonItem>
    </IonContent>

    <FormModalContainer
      title="Log Income"
      submitHandler={handleSubmit}
      disabled={!imEarning}
    >
      <IonContent color="light">
        <AmountInput
          value={amount}
          onKeyPress={e => {
            if (e.key === "Enter") handleSubmit()
          }}
          onChange={e => setAmount(e.detail.value)}
        />
      </IonContent>
    </FormModalContainer>
  </IonPage>
}

export default Income
