import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonPage, IonItem, IonToolbar, IonListHeader, IonCol,
  IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonList, IonText, IonHeader,
} from '@ionic/react'
import { arrowBack, trash, checkmark, create } from "ionicons/icons"

import { currencyFilter } from "../../features/profile/utils"
import { deleteSchedule } from "../../features/profile"
import { showToast } from '../../features/app'
import { L } from '../../utils/language'
import ScheduleForm from './ScheduleForm'

const Schedules = ({ closeHandler }) => {

  const currency = useSelector(state => state.app.currency)
  const data = useSelector(state => state.profile.data)
  const fullSchedules = useSelector(state => state.profile.schedules)
  const l = useSelector(state => state.profile.language)
  const schedules = currencyFilter(fullSchedules, currency)
  schedules.reverse()
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false);

  return <IonPage>
    <IonHeader>
      <IonToolbar color="tertiary">
        <IonButtons slot="start">
          <IonButton onClick={closeHandler}>
            <IonIcon slot="icon-only" icon={arrowBack} />
          </IonButton>
        </IonButtons>
        <IonTitle>{currency} {L("Schedules", l)}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => setEditing(!editing)}>
            <IonIcon slot="icon-only" icon={editing ? checkmark : create} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent color="light">
      <IonList>
        {schedules.length === 0
          ? <IonText>{L("No schedules.", l)}</IonText>
          : <IonListHeader color="light">
            <IonCol>{L("Description", l)}</IonCol>
            <IonCol size="2.4">{L("Type", l)}</IonCol>
            <IonCol size="1" />
            <IonCol size="1.7">{L("Day", l)}</IonCol>
            <IonCol class="ion-text-right ion-padding-end">{L("Amount", l)}</IonCol>
            {editing ? <IonCol size="2" /> : null}
          </IonListHeader>}
        {schedules.map((schedule, index) => {
          return (
            <IonItem key={index} color="light">
              <IonCol>{schedule.description}</IonCol>
              <IonCol size="2.4">{L(schedule.type, l)}</IonCol>
              <IonCol size="1">{L("on", l)}</IonCol>
              <IonCol size="1.7">
                {schedule.index.length > 3
                  ? l === "en"
                    ? schedule.index.slice(0, 3)
                    : L(schedule.index, l).slice(2, 3)
                  : schedule.index}
              </IonCol>
              <IonCol class="ion-text-right">
                {schedule.amount.toFixed(2)}
              </IonCol>
              {editing
                ? <IonCol size="1.5">
                  <IonButtons>
                    <IonButton onClick={() => {
                      dispatch(deleteSchedule(schedule, data, fullSchedules))
                      dispatch(showToast(L("Schedule deleted", l)))
                    }}>
                      <IonIcon slot="icon-only" icon={trash} color="danger" />
                    </IonButton>
                  </IonButtons>
                </IonCol>
                : null}
            </IonItem>
          )
        })}
      </IonList>
    </IonContent>
    <ScheduleForm currency={currency} />
  </IonPage>
}

export default Schedules
