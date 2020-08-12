import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, checkmark, create } from "ionicons/icons"
import { currencyFilter } from "../features/profile/utils"
import { deleteFamilyEntry } from "../features/profile"
import './Styles.css'

import {
  IonPage, IonItem, IonToolbar, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonHeader, IonItemDivider,
  IonItemGroup, IonLabel, IonText, IonDatetime, IonCheckbox
} from '@ionic/react'
import { showToast } from '../features/app'
import { L } from '../utils/language'
import FamilyEntryForm from '../components/FamilyEntryForm'
import { getMonthPickerValue } from '../utils/dateFunctions'
import DailyList from '../components/DailyList'

const Family = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const family = useSelector(state => state.profile.family)
  const l = useSelector(state => state.profile.language)
  const fullJournal = family.journal
  const data = family.data[currency]
  const profileCreated = useSelector(
    state => state.profile.data.currencies[currency].profileCreated
  )
  const {
    remainingMonth,
    incomeMonth,
    savings
  } = data
  const journal = currencyFilter(
    fullJournal,
    currency
  )
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

  const [filter, setFilter] = useState({
    year: new Date().toDateString().split(" ")[3],
    month: new Date().toDateString().split(" ")[1],
    reverse: true
  });

  const filteredJournal = journal.filter(
    entry =>
      entry.date.split(" ")[3] === filter.year
      && entry.date.split(" ")[1] === filter.month
  )
  if (filter.reverse) filteredJournal.reverse()

  const setSelectedMonth = string => {
    const dateArray = new Date(string).toDateString().split(" ")
    setFilter({
      ...filter,
      year: dateArray[3],
      month: dateArray[1]
    })
  }

  const selectColor = (number) => {
    if (number === 0) return "medium"
    else if (number < 0) return "danger"
    else return undefined
  }

  const deleteHandler = entry => {
    dispatch(deleteFamilyEntry(
      entry,
      family.data,
      fullJournal
    ))
    dispatch(showToast("Entry deleted"))
  }

  return (
    <IonPage color="light">
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonButton onClick={closeHandler}>
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{currency} {L("Family", l)}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditing(!editing)}>
              <IonIcon slot="icon-only" icon={editing ? checkmark : create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonItemGroup>
        <IonItemDivider color="light">
          <IonLabel>{L("This Month", l)}</IonLabel>
        </IonItemDivider>
        <IonItem color="light" class="ion-text-center">
          <IonLabel>
            <IonText color={selectColor(remainingMonth)} class="x-large">
              {remainingMonth.toFixed(2)}
            </IonText>
            <IonText>
              {" "}/{incomeMonth.toFixed(2)}
            </IonText>
          </IonLabel>
        </IonItem>
        <IonItemDivider color="light">
          <IonLabel>{L("Overall", l)}</IonLabel>
        </IonItemDivider>
        <IonItem color="light">
          <IonCol>{L("Savings", l)}:</IonCol>
          <IonCol class="ion-text-right">
            <IonText color={selectColor(savings)}>
              {savings.toFixed(2)}
            </IonText>
          </IonCol>
        </IonItem>
        <IonItemDivider color="light">
          {L("Journal", l)}
        </IonItemDivider>
      </IonItemGroup>
      <IonItem color="light">
        <IonCol>
          <IonItem color="light">
            <IonLabel position="floating">{L("Select Month", l)}</IonLabel>
            <IonDatetime
              displayFormat="YYYY-MM"
              placeholder={L("Select Month", l)}
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

      <DailyList
        list={filteredJournal}
        editing={editing}
        deleteHandler={deleteHandler}
      />

      <FamilyEntryForm currency={currency} />
    </IonPage>
  )
}

export default Family
