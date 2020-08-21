import React from 'react'
import { useSelector } from 'react-redux'
import { IonItem, IonLabel, IonInput } from '@ionic/react'

import { L } from '../../utils/language'

const CurrencyInput = ({
  value,
  compRef,
  onKeyPress,
  onChange,
  autofocus = false
}) => {

  const l = useSelector(state => state.profile.language)

  return <IonItem color="inherit">
    <IonLabel position="floating">{L("Currency", l)}</IonLabel>
    <IonInput
      type="text"
      maxlength={3}
      minlength={3}
      value={value}
      ref={compRef}
      autofocus={autofocus}
      onKeyPress={onKeyPress}
      onIonChange={onChange} />
  </IonItem>
}

export default CurrencyInput