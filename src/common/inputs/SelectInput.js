import React from 'react'
import { useSelector } from 'react-redux'
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react'
import { L } from '../../utils/language'

const SelectInput = ({
  label,
  value,
  compRef,
  onChange,
  options,
  cancelText,
  placeholder
}) => {

  const l = useSelector(state => state.profile.language)

  return <IonItem color="inherit">
    <IonLabel position="floating">{L(label, l)}</IonLabel>
    <IonSelect
      ref={compRef}
      interface="action-sheet"
      cancelText={L(cancelText, l)}
      value={value}
      placeholder={L(placeholder, l)}
      onIonChange={onChange}
    >
      {options.map((option, index) =>
        <IonSelectOption key={index} value={option}>
          {L(option, l)}
        </IonSelectOption>
      )}
    </IonSelect>
  </IonItem>
}

export default SelectInput