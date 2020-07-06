import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, trash, checkmark, create } from "ionicons/icons"
import { setLocation } from "../features/navigation"
import { currencyFilter } from "../features/profile/utils"
import { deleteEntry } from "../features/profile"

import {
  IonPage, IonItem, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonList, IonContent, IonListHeader, IonCol
} from '@ionic/react'

const Journal = () => {
  const currency = useSelector(state => state.navigation.currency)
  const data = useSelector(state => state.profile.data)
  const fullJournal = useSelector(state => state.profile.journal)
  const journal = currencyFilter(
    fullJournal,
    currency
  )
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

  return (
    <IonPage>
      <IonContent>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonButton onClick={() => dispatch(setLocation("summary"))}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Journal for {currency}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditing(!editing)}>
              <IonIcon icon={editing ? checkmark : create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonList>
          <IonListHeader>
            <IonCol size="3.5">Date</IonCol>
            <IonCol>Description</IonCol>
            <IonCol class="ion-text-right ion-padding-end">Amount</IonCol>
            {editing ? <IonCol size="1.5" /> : null}
          </IonListHeader>
          {journal.map((entry, index) => {
            return (
              <IonItem key={index}>
                <IonCol size="3.5">{entry.date}</IonCol>
                <IonCol>{entry.description}</IonCol>
                <IonCol class="ion-text-right">
                  {entry.amount.toFixed(2)}
                </IonCol>
                {editing
                  ? <IonCol size="1.5" class="ion-text-center">
                    {editing && entry.description !== "Initial Savings"
                      ? <IonButton onClick={() => dispatch(deleteEntry(entry, data, fullJournal))} >
                        <IonIcon icon={trash} />
                      </IonButton>
                      : null}
                  </IonCol>
                  : null}

              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Journal