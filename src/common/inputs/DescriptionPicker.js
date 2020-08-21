import React from 'react'
import { IonChip, IonLabel } from '@ionic/react'

const DescriptionPicker = ({ descriptions, onClick }) =>
  <p>
    {descriptions.map(description =>
      <IonChip
        key={description}
        onClick={() => onClick(description)}
      >
        <IonLabel>{description}</IonLabel>
      </IonChip>
    )}
  </p>

export default DescriptionPicker