import React from "react";
import { useSelector } from 'react-redux'
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add, close } from 'ionicons/icons'

const Fab = ({ shown, onClick, disabled = false }) => {

  const showAd = useSelector(state => state.app.showAd)

  return <IonFab
    slot="fixed"
    class={showAd ? "fab" : undefined}
    vertical="bottom"
    horizontal="end"
  >
    <IonFabButton onClick={onClick} disabled={disabled}>
      <IonIcon icon={shown ? close : add} />
    </IonFabButton>
  </IonFab>
}

export default Fab