import React from 'react'
import { useSelector } from 'react-redux'
import { IonItem, IonLabel, IonInput } from '@ionic/react'

import { L } from '../../utils/language'

const AmountInput = ({
  label = "Amount",
  placeholder = "How Much",
  value,
  compRef,
  onKeyPress,
  onChange
}) => {

  const l = useSelector(state => state.profile.language)

  return <IonItem color="inherit">
    <IonLabel position="floating">{L(label, l)}</IonLabel>
    <IonInput
      type="number"
      value={value}
      placeholder={L(placeholder, l)}
      ref={compRef}
      onKeyPress={onKeyPress}
      onIonChange={onChange} />
  </IonItem>
}

export default AmountInput