import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, trash, checkmark, create } from "ionicons/icons"
import { currencyFilter } from "../features/profile/utils"
import { deleteFamilyEntry } from "../features/profile"
import './Styles.css'

import {
  IonPage, IonItem, IonToolbar, IonContent, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonList, IonHeader, IonItemDivider,
  IonItemGroup, IonLabel, IonText
} from '@ionic/react'
import { showToast } from '../features/app'
import { L } from '../utils/language'
import FamilyEntryForm from '../components/FamilyEntryForm'

const Family = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const family = useSelector(state => state.profile.family)
  const l = useSelector(state => state.profile.language)
  const fullJournal = family.journal
  const data = family.data[currency]
  const {
    remainingMonth,
    incomeMonth,
    savings
  } = data
  const journal = currencyFilter(
    fullJournal,
    currency
  )
  journal.reverse()
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

  const selectColor = (number) => {
    if (number === 0) return "medium"
    else if (number < 0) return "danger"
    else return undefined
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
      <IonContent color="light">
        <IonList>
          <IonListHeader color="light">
            <IonCol size="4.5">{L("Date", l)}</IonCol>
            <IonCol>{L("Description", l)}</IonCol>
            <IonCol class="ion-text-right ion-padding-end">
              {L("Amount", l)}
            </IonCol>
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
                        dispatch(deleteFamilyEntry(
                          entry,
                          family.data,
                          fullJournal
                        ))
                        dispatch(showToast("Entry deleted"))
                      }} >
                        <IonIcon
                          slot="icon-only"
                          color="danger"
                          icon={trash}
                        />
                      </IonButton>
                    </IonButtons>
                    : null}
                </IonCol>
                : null}
            </IonItem>
          })}
        </IonList>
      </IonContent>
      <FamilyEntryForm currency={currency} />
    </IonPage>
  )
}

export default Family
