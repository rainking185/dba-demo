import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonHeader, IonMenu, IonTitle, IonToolbar, IonContent, IonList,
  IonItem, IonMenuButton, IonButtons, IonIcon, IonToast,
  IonMenuToggle, IonRouterOutlet, IonButton
} from '@ionic/react';
import { setLocation } from '../features/navigation'
import { changeCurrency } from '../features/profile'
import { logoUsd, book, calendar } from 'ionicons/icons'
import "./Styles.css"

const Header = (props) => {

  const currency = useSelector(state => state.navigation.currency)
  const data = useSelector(state => state.profile.data)
  const currencyInUse = useSelector(state => state.profile.data.profile.currencyInUse)
  const currencyToUse = useSelector(state => state.profile.data.profile.currencyToUse)
  const [checked, setChecked] = useState((currency === currencyToUse && currencyInUse !== currencyToUse) || (currency === currencyInUse && currencyInUse === currencyToUse));
  let message = "Use this currency"
  if (checked) {
    if (currencyToUse === currencyInUse) message = "Using this currency"
    else message = "Will use this currency"
  }

  const [toast, setToast] = useState({
    shown: false,
    message: ""
  });

  const handleChangeCurrency = () => {
    setChecked(true)
    dispatch(changeCurrency(currency, data))
    setToast({ shown: true, message: "You will be using this currency tomorrow." })
  }

  const dispatch = useDispatch()

  return (
    <>
      <IonToolbar color={checked ? "primary" : "secondary"}>
        <IonButtons slot="start">
          <IonMenuButton menu="menu" />
        </IonButtons>
        <IonTitle>{currency}</IonTitle>
        <IonButtons slot="end">
          <IonItem color={checked ? "primary" : "warning"}>
            <IonButton
              disabled={checked}
              onClick={handleChangeCurrency}

            >
              {message}
            </IonButton>
          </IonItem>
        </IonButtons>
      </IonToolbar>
      <IonMenu menuId="menu" contentId="main">
        <IonHeader>
          <IonToolbar color={checked ? "primary" : "warning"}>
            <IonButtons slot="start">
              <IonMenuButton menu="menu" />
            </IonButtons>
            <IonTitle>{currency}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle menu="menu" >
              <IonItem button onClick={() => dispatch(setLocation("currencies"))}>
                <IonIcon slot="start" icon={logoUsd} />
                Currencies
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem button onClick={() => dispatch(setLocation("journal"))}>
                <IonIcon slot="start" icon={book} />
                Journal
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem button onClick={() => dispatch(setLocation("schedules"))}>
                <IonIcon slot="start" icon={calendar} />
                Schedules
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonRouterOutlet id="main"></IonRouterOutlet>
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast({ shown: false, message: "" })}
        message={toast.message}
        duration={1000}
      />
    </>
  )
}

export default Header
