import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { IonModal, IonToolbar, IonButton, IonTitle } from '@ionic/react'

import Fab from '../Fab'
import { L } from '../../utils/language'

const FormModalContainer = ({
  className = "default-modal",
  children,
  title,
  clearHandler,
  submitHandler,
  disabled = false,
  closeOnSubmit = true
}) => {

  const l = useSelector(state => state.profile.language)

  const [shown, setShown] = useState(false);

  const fab = <Fab shown={shown} onClick={() => setShown(!shown)} disabled={disabled} />

  const handleSubmit = () => {
    let submitted = submitHandler()
    if (submitted && closeOnSubmit) setShown(false)
  }

  return <>
    {fab}
    <IonModal
      isOpen={shown}
      onDidDismiss={() => setShown(false)}
      class={className}>
      {fab}
      <IonToolbar color="medium">
        {clearHandler !== undefined &&
          <IonButton
            class="ion-padding-start"
            slot="start"
            onClick={clearHandler}>
            {L("CLEAR", l)}
          </IonButton>}

        <IonTitle>
          {L(title, l)}
        </IonTitle>
        <IonButton
          class="ion-padding-end"
          slot="end"
          onClick={handleSubmit}>
          {L("ADD", l)}
        </IonButton>
      </IonToolbar>

      {children}
    </IonModal>
  </>
}

export default FormModalContainer