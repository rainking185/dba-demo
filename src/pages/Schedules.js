import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, trash, checkmark, create } from "ionicons/icons"
import { setLocation } from "../features/navigation"
import { currencyFilter } from "../features/profile/utils"
import {
  IonPage, IonItem, IonLabel, IonToolbar, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonList, IonText,
} from '@ionic/react'
import ScheduleForm from '../components/ScheduleForm'
import { deleteSchedule } from "../features/profile"

const Schedules = () => {

  const currency = useSelector(state => state.navigation.currency)
  const data = useSelector(state => state.profile.data)
  const fullSchedules = useSelector(state => state.profile.schedules)
  const schedules = currencyFilter(fullSchedules, currency)
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
          <IonTitle>Schedules for {currency} </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditing(!editing)}>
              <IonIcon icon={editing ? checkmark : create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonListHeader>
          <IonCol>Description</IonCol>
          <IonCol size="1.5">Type</IonCol>
          <IonCol size="1" />
          <IonCol size="2">Day/Date</IonCol>
          <IonCol class="ion-text-right ion-padding-end">Amount</IonCol>
          {editing ? <IonCol size="1.5" /> : null}
        </IonListHeader>
        <IonList>
          {schedules.map((schedule, index) => {
            return (
              <IonItem key={index}>
                <IonCol>{schedule.description}</IonCol>
                <IonCol size="1.5">{schedule.type}</IonCol>
                <IonCol size="1">on</IonCol>
                <IonCol size="2">{schedule.index}</IonCol>
                <IonCol class="ion-text-right">
                  {schedule.amount.toFixed(2)}
                </IonCol>
                {editing
                  ? <IonCol size="1.5" class="ion-text-center">
                    <IonButton onClick={() => dispatch(deleteSchedule(schedule, data, fullSchedules))} >
                      <IonIcon icon={trash} />
                    </IonButton>
                  </IonCol>
                  : null}
              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
      <ScheduleForm currency={currency} />
    </IonPage>
  )
}

export default Schedules