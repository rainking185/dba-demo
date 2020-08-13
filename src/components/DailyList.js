import React from 'react'
import { useSelector } from 'react-redux'
import { IonContent, IonList, IonText, IonListHeader, IonCol, IonIcon, IonItem, IonButtons, IonButton } from '@ionic/react'
import { L } from '../utils/language'
import { trash } from 'ionicons/icons'

const DailyList = props => {

  const {
    list,
    editing,
    deleteHandler
  } = props

  const l = useSelector(state => state.profile.language)

  return <IonContent color="light">
    <IonList>
      {list.length === 0
        ? <IonText>{L("No entries.", l)}</IonText>
        : <IonListHeader color="light">
          <IonCol size="1.5">{L("Date", l)}</IonCol>
          <IonCol size="1.5">{L("Day", l)}</IonCol>
          <IonCol>{L("Description", l)}</IonCol>
          <IonCol class="ion-text-right ion-padding-end">{L("Amount", l)}</IonCol>
          {editing ? <IonCol size="1.7" /> : null}
        </IonListHeader>}

      {list.map((entry, index) => {
        return <IonItem color="light" key={index}>
          <IonCol size="1.5">{entry.date.split(" ")[2]}</IonCol>
          <IonCol size="1.5">{L(entry.date.split(" ")[0], l)}</IonCol>
          <IonCol>{entry.description}</IonCol>
          <IonCol class="ion-text-right">
            {entry.amount.toFixed(2)}
          </IonCol>
          {editing
            ? <IonCol size="1.5" class="ion-text-center">
              {editing && entry.description !== "Initial Savings"
                ? <IonButtons>
                  <IonButton onClick={() => deleteHandler(entry)} >
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
}

export default DailyList