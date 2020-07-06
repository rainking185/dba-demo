import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonPage, IonItem, IonLabel, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonText, IonToast,
  IonPopover,
  IonContent,
  IonList
} from '@ionic/react'
import { arrowBack, trash, checkmark, create, time, eye } from "ionicons/icons"
import { setLocation, setCurrency } from "../features/navigation"
import { deleteCurrency } from "../features/profile"
import { getCurrenciesSummary } from "../features/profile/utils"
import CurrencyForm from '../components/CurrencyForm'

const Currencies = () => {

  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const [editing, setEditing] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [currencySelected, setCurrencySelected] = useState("");
  const currencyDisplaying = useSelector(state => state.navigation.currency)
  const currenciesInProfile = useSelector(state => state.profile.data.profile.currencies)
  const currencies = getCurrenciesSummary(currenciesInProfile)

  const [toast, setToast] = useState({
    shown: false,
    message: ""
  });

  const handleChangeCurrency = (currency) => {
    dispatch(setCurrency(currency))
    dispatch(setLocation("summary"))
  }

  const handleDeleteCurrency = () => {
    if (Object.keys(currencies).length <= 1) {
      setToast({ shown: true, message: "You cannot delete the last currency you have." })
    } else if (currencySelected === profile.data.profile.currencyToUse) {
      setToast({ shown: true, message: "You cannot delete the currency you are using." })
    } else {
      dispatch(deleteCurrency(currencySelected, profile))
      setToast({ shown: true, message: "Currency deleted." })
    }
    setShowPopover(false)
  }

  const handleBack2Summary = () => {
    if (!Object.keys(currenciesInProfile).includes(currencyDisplaying)) {
      dispatch(setCurrency(profile.data.profile.currencyToUse))
    }
    dispatch(setLocation("summary"))
  }

  const Icons = (props) => {
    const { currency } = props

    var icon = undefined

    if (profile.data.profile.currencyInUse === profile.data.profile.currencyToUse) {
      if (currency === profile.data.profile.currencyInUse) icon = checkmark
    } else {
      if (currency === profile.data.profile.currencyInUse) icon = time
      else if (currency === profile.data.profile.currencyToUse) icon = checkmark
    }

    var color = undefined

    if (icon === checkmark) color = "primary"
    else if (icon === time) color = "warning"

    return <IonIcon slot="start" icon={icon} color={color} />
  }

  return (
    <IonPage>
      <IonContent>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonButton onClick={handleBack2Summary}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Currencies</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditing(!editing)}>
              <IonIcon icon={editing ? checkmark : create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonList>
          {currencies.map(currency => {
            return (
              <IonItem
                button={!editing}
                key={currency.name}
                onClick={editing ? null : () => handleChangeCurrency(currency.name)}
              >
                <Icons currency={currency.name} />
                <IonLabel>
                  {currency.name}
                </IonLabel>
                {currency.name === currencyDisplaying ? <IonIcon icon={eye} /> : null}
                <IonText slot="end" color={currency.savings < 0 ? "danger" : undefined}>
                  {currency.savings}
                </IonText>
                {editing
                  ? <IonButton slot="end" onClick={() => {
                    setShowPopover(true)
                    setCurrencySelected(currency.name)
                  }}>
                    <IonIcon icon={trash} />
                  </IonButton>
                  : null}
              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={e => setShowPopover(false)}
      >
        <IonText>Are you sure you want to delete {currencySelected}? This action is not reversible.</IonText>
        <IonButtons>
          <IonButton onClick={handleDeleteCurrency}>Yes</IonButton>
          <IonButton onClick={() => setShowPopover(false)}>No</IonButton>
        </IonButtons>
      </IonPopover>
      <CurrencyForm />
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast({ shown: false, message: "" })}
        message={toast.message}
        duration={1000}
      />
    </IonPage>
  )
}

export default Currencies
