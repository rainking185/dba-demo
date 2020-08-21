import React, { useRef } from 'react'
import { IonContent } from '@ionic/react'

import CurrencyInput from '../../common/inputs/CurrencyInput'
import AmountInput from '../../common/inputs/AmountInput'

const CurrencyForm = ({
  formValue,
  handleChange,
  handleSubmit
}) => {

  const currencyRef = useRef(null)
  const savingsRef = useRef(null)
  const budgetRef = useRef(null)

  return <IonContent color="light">

    <CurrencyInput
      value={formValue.currency}
      compRef={currencyRef}
      onKeyPress={e => {
        if (e.key === "Enter") savingsRef.current.setFocus()
      }}
      onChange={e => handleChange("currency", e.detail.value)}
    />

    <AmountInput
      value={formValue.savings}
      label="Savings"
      placeholder="Savings to Start"
      compRef={savingsRef}
      onKeyPress={e => {
        if (e.key === "Enter") budgetRef.current.setFocus()
      }}
      onChange={e => handleChange("savings", e.detail.value)}
    />

    <AmountInput
      value={formValue.dailyBudget}
      label="Daily Budget"
      placeholder="Daily Budget"
      compRef={budgetRef}
      onKeyPress={e => {
        if (e.key === "Enter") handleSubmit()
      }}
      onChange={e => handleChange("dailyBudget", e.detail.value)}
    />

  </IonContent>
}

export default CurrencyForm