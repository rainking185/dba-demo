import React from 'react'
import { useSelector } from 'react-redux'
import { IonItem, IonToggle } from '@ionic/react'

import { L } from '../../utils/language'

const BooleanInput = ({
  falseLabel,
  trueLabel,
  checked,
  onChange
}) => {

  const l = useSelector(state => state.profile.language)

  return <IonItem color="inherit">
    {L(falseLabel, l)}
    <IonToggle
      checked={checked}
      onIonChange={onChange} />
    {L(trueLabel, l)}
  </IonItem>
}

export default BooleanInput