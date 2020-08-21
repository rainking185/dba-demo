import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonPage, IonItem, IonToolbar, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonHeader,
  IonDatetime, IonLabel, IonCheckbox
} from '@ionic/react'
import { arrowBack, checkmark, create } from "ionicons/icons"

import { currencyFilter } from "../../features/profile/utils"
import { deleteEntry } from "../../features/profile"
import { showToast } from '../../features/app'
import { L } from '../../utils/language'
import { getMonthPickerValue } from '../../utils/dateFunctions'
import DailyList from '../../common/DailyList'

const Journal = ({ closeHandler }) => {

  const currency = useSelector(state => state.app.currency)
  const data = useSelector(state => state.profile.data)
  const profileCreated = data.currencies[currency].profileCreated
  const fullJournal = useSelector(state => state.profile.journal)
  const l = useSelector(state => state.profile.language)
  const journal = currencyFilter(
    fullJournal,
    currency
  )
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

  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

  const setSelectedMonth = string => {
    const dateArray = new Date(string).toDateString().split(" ")
    setFilter({
      ...filter,
      year: dateArray[3],
      month: dateArray[1]
    })
  }

  const deleteHandler = entry => {
    dispatch(deleteEntry(entry, data, fullJournal))
    dispatch(showToast("Entry deleted"))
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
          <IonTitle>{currency} {L("Journal", l)}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditing(!editing)}>
              <IonIcon slot="icon-only" icon={editing ? checkmark : create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
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
    </IonPage>
  )
}

export default Journal
