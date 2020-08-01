import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, trash, checkmark, create } from "ionicons/icons"
import { currencyFilter } from "../features/profile/utils"
import { deleteEntry } from "../features/profile"
import './Styles.css'

import {
  IonPage, IonItem, IonToolbar, IonContent, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonList, IonHeader
} from '@ionic/react'
import { showToast } from '../features/app'
import { L } from '../utils/language'

const Journal = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const data = useSelector(state => state.profile.data)
  const fullJournal = useSelector(state => state.profile.journal)
  const l = useSelector(state => state.profile.language)
  const journal = currencyFilter(
    fullJournal,
    currency
  )
  journal.reverse()
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

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

      <IonContent color="light">
        <IonList>
          <IonListHeader color="light">
            <IonCol size="4.5">{L("Date", l)}</IonCol>
            <IonCol>{L("Description", l)}</IonCol>
            <IonCol class="ion-text-right ion-padding-end">{L("Amount", l)}</IonCol>
            {editing ? <IonCol size="1.7" /> : null}
          </IonListHeader>
          {journal.map((entry, index) => {
            return <IonItem color="light" key={index}>
              <IonCol size="4.5">{entry.date}</IonCol>
              <IonCol>{entry.description}</IonCol>
              <IonCol class="ion-text-right">
                {entry.amount.toFixed(2)}
              </IonCol>
              {editing
                ? <IonCol size="1.5" class="ion-text-center">
                  {editing && entry.description !== "Initial Savings"
                    ? <IonButtons>
                      <IonButton onClick={() => {
                        dispatch(deleteEntry(entry, data, fullJournal))
                        dispatch(showToast("Entry deleted"))
                      }} >
                        <IonIcon slot="icon-only" color="danger" icon={trash} />
                      </IonButton>
                    </IonButtons>
                    : null}
                </IonCol>
                : null}
            </IonItem>
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Journal
