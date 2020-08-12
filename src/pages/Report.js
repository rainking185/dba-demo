import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { arrowBack } from "ionicons/icons"
import { currencyFilter } from "../features/profile/utils"
import './Styles.css'

import {
  IonPage, IonItem, IonToolbar, IonContent, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonList, IonHeader, IonToggle, IonCheckbox, IonLabel, IonDatetime, IonText, IonItemGroup
} from '@ionic/react'
import { L } from '../utils/language'
import { getMonthPickerValue, getYearMonthString, MMM2M } from '../utils/dateFunctions'



const Report = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const profileCreated = useSelector(
    state => state.profile.data.currencies[currency].profileCreated
  )
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

  const [filter, setFilter] = useState({
    year: new Date().toDateString().split(" ")[3],
    month: new Date().toDateString().split(" ")[1],
    reverse: true
  });

  const filteredJournal = useJournal.filter(
    entry =>
      entry.date.split(" ")[3] === filter.year
      && entry.date.split(" ")[1] === filter.month
  )
  if (filter.reverse) filteredJournal.reverse()

  const mix = filteredJournal.reduce((prev, cur) => {
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


  const setSelectedMonth = string => {
    const dateArray = new Date(string).toDateString().split(" ")
    setFilter({
      ...filter,
      year: dateArray[3],
      month: dateArray[1]
    })
  }

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
      <IonItemGroup>
        <IonItem color="light">
          {L("Personal", l)}
          <IonToggle
            checked={state.isFamily}
            onIonChange={e => setState({
              ...state,
              isFamily: e.detail.checked
            })} />
          {L("Family", l)}
        </IonItem>
        <IonItem color="light">
          {L("Daily", l)}
          <IonToggle
            checked={state.isMonthly}
            onIonChange={e => setState({
              ...state,
              isMonthly: e.detail.checked
            })} />
          {L("Monthly ", l)}
        </IonItem>
        <IonItem color="light">
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
        <IonItem color="light">
          <IonCol>
            <IonItem color="light">
              <IonLabel position="floating">
                {L(state.isMonthly ? "Select Year" : "Select Month", l)}
              </IonLabel>
              <IonDatetime
                displayFormat={state.isMonthly ? "YYYY" : "YYYY-MM"}
                placeholder={L(state.isMonthly ? "Select Year" : "Select Month", l)}
                min={new Date(profileCreated).toISOString().slice(0, 10)}
                max={new Date().toISOString().slice(0, 7)}
                value={getMonthPickerValue(filter)}
                onIonChange={e => setSelectedMonth(e.detail.value)}
                doneText={L("DONE", l)}
                cancelText={L("CANCEL", l)}
              />
            </IonItem>
          </IonCol>
          <IonCol />
          <IonCol>
            <IonItem color="light">
              <IonLabel>{L("Descending", l)}</IonLabel>
              <IonCheckbox
                slot="start"
                checked={filter.reverse}
                onIonChange={e => setFilter({
                  ...filter,
                  reverse: e.detail.checked
                })} />
            </IonItem>
          </IonCol>
        </IonItem>
      </IonItemGroup>

      <IonContent color="light">
        <IonList>
          {content.length === 0
            ? <IonText>{L("No records.", l)}</IonText>
            : <IonListHeader color="light">
              {state.isMonthly
                ? <IonCol size="2">{L("Month", l)}</IonCol>
                : <>
                  <IonCol size="1.5">{L("Date", l)}</IonCol>
                  <IonCol size="1.5">{L("Day", l)}</IonCol>
                </>}
              <IonCol class="ion-text-right ion-padding-end">{L("Amount", l)}</IonCol>
            </IonListHeader>}
          {content.map((entry, index) => {
            return <IonItem color="light" key={index}>
              {state.isMonthly
                ? <IonCol size="2">{MMM2M(entry.date.split(" ")[1])}</IonCol>
                : <>
                  <IonCol size="1.5">{entry.date.split(" ")[2]}</IonCol>
                  <IonCol size="1.5">{entry.date.split(" ")[0]}</IonCol>
                </>}
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
