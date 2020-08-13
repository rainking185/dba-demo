import React, { useState } from 'react'
import {
  IonPage, IonLoading, IonText, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonModal, IonCard, IonCardContent, IonCardTitle
} from '@ionic/react'
import { useSelector, useDispatch } from 'react-redux'
import { L } from '../utils/language'
import { informationCircle } from 'ionicons/icons'
import Help from './Help'
import { requestPermissions } from '../features/profile'

const Loading = props => {
  const { failed = false } = props
  const l = useSelector(state => state.profile.language)

  const dispatch = useDispatch()

  const [shown, setShown] = useState(false) // For the help page displayed in Modal


  return <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonButton onClick={() => setShown(true)}>
            <IonIcon slot="icon-only" icon={informationCircle} />
          </IonButton>
        </IonButtons>
        <IonTitle>{L("Welcome to DBA!", l)}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonGrid style={{ height: "100%" }}>
        <IonRow style={{ height: "100%" }} class="ion-text-center ion-justify-content-center ion-align-items-center">
          <IonCol>
            {failed
              ? <IonCard>
                <IonCardTitle>
                  <IonText>
                    <h2>{L('Please enable DBA to access your storage.', l)}</h2>
                  </IonText>
                </IonCardTitle>
                <IonCardContent>
                  <IonButton style={{ width: "100%" }} onClick={() => dispatch(requestPermissions())}>
                    {L("OK", l)}
                  </IonButton>
                </IonCardContent>
              </IonCard>
              : <></>}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>

    <IonLoading
      isOpen={!failed}
      message={L('Loading your profile...', l)}
    />

    <IonModal
      isOpen={shown}
      onDidDismiss={() => setShown(false)}>
      <Help closeHandler={() => setShown(false)} />
    </IonModal>
  </IonPage>
}

export default Loading