import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { arrowBack } from "ionicons/icons"
import { currencyFilter } from "../features/profile/utils"
import './Styles.css'

import {
  IonPage, IonItem, IonToolbar, IonContent, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonList, IonHeader, IonToggle, IonCheckbox, IonLabel
} from '@ionic/react'
import { L } from '../utils/language'

const getYearMonthString = dateString => {
  let words = dateString.split(" ")
  return words[3] + " " + words[1]
}

const Report = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const fullJournal = useSelector(state => state.profile.journal)
  const fullFamilyJournal = useSelector(state => state.profile.family.journal)
  const l = useSelector(state => state.profile.language)
  const journal = currencyFilter(
    fullJournal,
    currency
  )
  const familyJournal = currencyFilter(
    fullFamilyJournal,
    currency
  )

  const [state, setState] = useState({
    isFamily: false,
    isMonthly: false,
    excludeBudget: false
  });

  const useJournal = state.isFamily ? familyJournal : journal

  const mix = useJournal.reduce((prev, cur) => {
    if (state.excludeBudget && (
      (!state.isFamily
        && ["Daily Budget", "Initial Savings"].includes(cur.description))
      || (state.isFamily && cur.isIncome)
    )) return prev
    let newPrev = { ...prev }
    if (state.isMonthly) {
      if (getYearMonthString(cur.date) !== prev.date) {
        newPrev.content[getYearMonthString(cur.date)] = cur.amount
        newPrev = {
          ...newPrev,
          date: getYearMonthString(cur.date)
        }
      } else newPrev.content[getYearMonthString(cur.date)] += cur.amount
    } else {
      if (cur.date !== prev.date) {
        newPrev.content[cur.date] = cur.amount
        newPrev = {
          ...newPrev,
          date: cur.date
        }
      } else newPrev.content[cur.date] += cur.amount
    }
    return newPrev
  }, {
    date: "",
    content: {}
  })

  let content = Object.keys(mix.content).map(date => {
    return {
      date: date,
      amount: mix.content[date]
    }
  })

  content.reverse()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonButton onClick={closeHandler}>
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{currency} {L(state.isFamily ? "Family" : "Personal", l)} {L("Report", l)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonItem color="inherit">
          {L("Personal", l)}
          <IonToggle
            checked={state.isFamily}
            onIonChange={e => setState({
              ...state,
              isFamily: e.detail.checked
            })} />
          {L("Family", l)}
        </IonItem>
        <IonItem color="inherit">
          {L("Daily", l)}
          <IonToggle
            disabled={state.isFamily}
            checked={state.isMonthly}
            onIonChange={e => setState({
              ...state,
              isMonthly: e.detail.checked
            })} />
          {L("Monthly ", l)}
        </IonItem>
        <IonItem color="inherit">
          <IonLabel>
            {L("Exclude", l)} {state.isFamily
              ? L("Income", l)
              : L("Budget", l)}
          </IonLabel>
          <IonCheckbox
            slot="start"
            checked={state.excludeBudget}
            onIonChange={e => setState({
              ...state,
              excludeBudget: e.detail.checked
            })} />
        </IonItem>
        <IonList>
          <IonListHeader color="light">
            <IonCol size="4.5">{L("Date", l)}</IonCol>
            <IonCol class="ion-text-right ion-padding-end">{L("Amount", l)}</IonCol>
          </IonListHeader>
          {content.map((entry, index) => {
            return <IonItem color="light" key={index}>
              <IonCol size="4.5">{entry.date}</IonCol>
              <IonCol class="ion-text-right">
                {entry.amount.toFixed(2)}
              </IonCol>
            </IonItem>
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Report
