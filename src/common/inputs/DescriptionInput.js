import React from 'react'
import { useSelector } from 'react-redux'
import { IonItem, IonLabel, IonInput } from '@ionic/react'

import { L } from '../../utils/language'

const DescriptionInput = ({
  value,
  compRef,
  onKeyPress,
  onChange
}) => {

  const l = useSelector(state => state.profile.language)

  return <IonItem color="inherit">
    <IonLabel position="floating">{L("Description", l)}</IonLabel>
    <IonInput
      ref={compRef}
      value={value}
      autocapitalize
      clearInput
      placeholder={L("For What", l)}
      onKeyPress={onKeyPress}
      onIonChange={onChange}
      autoCorrect={true} />
  </IonItem>
}

export default DescriptionInput