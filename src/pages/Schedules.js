import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { arrowBack, trash, checkmark, create } from "ionicons/icons"
import { currencyFilter } from "../features/profile/utils"
import {
  IonPage, IonItem, IonToolbar, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonList, IonText,
} from '@ionic/react'
import ScheduleForm from '../components/ScheduleForm'
import { deleteSchedule } from "../features/profile"

const Schedules = (props) => {
  const { closeHandler } = props
  const currency = useSelector(state => state.app.currency)
  const data = useSelector(state => state.profile.data)
  const fullSchedules = useSelector(state => state.profile.schedules)
  const schedules = currencyFilter(fullSchedules, currency)
  schedules.reverse()
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

  return (
    <IonPage>
      <IonToolbar color="tertiary">
        <IonButtons slot="start">
          <IonButton onClick={closeHandler}>
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

      <IonContent color="light">
        <IonList>
          {schedules.length === 0
            ? <IonText>No schedules.</IonText>
            : <IonListHeader color="light">
              <IonCol>Description</IonCol>
              <IonCol size="2.4">Type</IonCol>
              <IonCol size="1" />
              <IonCol size="1.7">Day</IonCol>
              <IonCol class="ion-text-right ion-padding-end">Amount</IonCol>
              {editing ? <IonCol size="2" /> : null}
            </IonListHeader>}
          {schedules.map((schedule, index) => {
            return (
              <IonItem key={index} color="light">
                <IonCol>{schedule.description}</IonCol>
                <IonCol size="2.4">{schedule.type}</IonCol>
                <IonCol size="1">on</IonCol>
                <IonCol size="1.7">
                  {schedule.index.length > 3
                    ? schedule.index.slice(0, 3) :
                    schedule.index}
                </IonCol>
                <IonCol class="ion-text-right">
                  {schedule.amount.toFixed(2)}
                </IonCol>
                {editing
                  ? <IonCol size="2" class="ion-text-center">
                    <IonButton onClick={() => dispatch(deleteSchedule(
                      schedule, data, fullSchedules
                    ))}>
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
