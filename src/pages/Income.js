import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, close, add } from "ionicons/icons"
import {
  IonPage, IonItem, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle,
  IonContent, IonHeader, IonLabel, IonFab, IonFabButton, IonModal,
  IonInput, IonText, IonCol, IonCheckbox,
} from '@ionic/react'
import { showToast } from '../features/app'
import BudgetForm from '../components/BudgetForm'
import { toggleImEarning, addIncome } from '../features/profile'
import { budgetGauge, currencyFilter } from '../features/profile/utils'

const Income = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const fullIncome = useSelector(state => state.profile.income)
  const income = currencyFilter(fullIncome, currency)
  const data = useSelector(state => state.profile.data)
  const summary = useSelector(
    state => state.profile.data.currencies[currency]
  )
  const {
    dailyBudget,
    remainingIncome = 0,
    totalIncome = 0,
    imEarning = false
  } = summary
  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')

  const [shown, setShown] = useState(false);

  const handleSubmit = () => {
    let err = ""
    if (amount === '') err += "What's the amount? "

    if (err !== "") dispatch(showToast(err))
    else {
      dispatch(addIncome(
        { amount: Number(amount), currency: currency },
        data, fullIncome
      ))
      dispatch(showToast("Income added."))
      setAmount('')
      setShown(false)
    }
  }

  const Fab = () => {
    return (
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShown(!shown)} disabled={!imEarning}>
          <IonIcon icon={shown ? close : add} />
        </IonFabButton>
      </IonFab>
    )
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={imEarning ? "danger" : "tertiary"}>
          <IonButtons slot="start">
            <IonButton onClick={closeHandler}>
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{currency} Income</IonTitle>
          <IonItem slot="end" color={imEarning ? "danger" : "tertiary"}>
            <IonLabel>I'M EARNING</IonLabel>
            <IonCheckbox
              slot="start"
              checked={imEarning}
              onIonChange={() => dispatch(toggleImEarning(currency))} />
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonItem color="light">
          <IonCol>Total Income:</IonCol>
          <IonCol class="ion-text-right">
            <IonText>
              {totalIncome.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>
        <IonItem color="light">
          <IonCol>
            Remaining Income:
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
          <IonCol>Daily Budget:</IonCol>
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
          <IonCol>Days covered:</IonCol>
          <IonCol class="ion-text-right">
            <IonText class="x-large" color={selectDaysColor(days)}>
              {days}
            </IonText>
          </IonCol>
        </IonItem>
      </IonContent>
      <Fab />
      <IonModal
        isOpen={shown}
        onDidDismiss={() => setShown(false)}
        class="default-modal">
        <Fab />
        <IonToolbar color="medium">
          <IonTitle>Log Entry</IonTitle>
          <IonButton
            class="ion-padding-end"
            slot="end"
            onClick={handleSubmit}>
            ADD
          </IonButton>
        </IonToolbar>

        <IonContent color="light">
          <IonItem color="inherit">
            <IonLabel position="floating">Amount</IonLabel>
            <IonInput
              type="number"
              value={amount}
              placeholder="How Much"
              onKeyPress={e => {
                if (e.key === "Enter") handleSubmit()
              }}
              onIonChange={e => setAmount(e.detail.value)} />
          </IonItem>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}

export default Income
