import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonMenu, IonTitle, IonToolbar, IonContent, IonList,
  IonItem, IonMenuButton, IonButtons, IonIcon,
  IonMenuToggle, IonRouterOutlet, IonButton, IonModal, IonHeader
} from '@ionic/react';
import { changeCurrency } from '../features/profile'
import { logoUsd, book, calendar, informationCircle, cash } from 'ionicons/icons'
import "./Styles.css"
import Currencies from '../pages/Currencies';
import Journal from '../pages/Journal';
import Schedules from '../pages/Schedules';
import { showToast } from '../features/app';
import Help from '../pages/Help';
import Income from '../pages/Income';

const Header = () => {
  const data = useSelector(state => state.profile.data)
  const currencyInUse = useSelector(
    state => state.profile.data.currencyInUse
  )
  const currencyToUse = useSelector(
    state => state.profile.data.currencyToUse
  )
  const currency = useSelector(state => state.app.currency)

  const [checked, setChecked] = useState(
    (currency === currencyToUse && currencyInUse !== currencyToUse)
    || (currency === currencyInUse && currencyInUse === currencyToUse)
  );

  useEffect(() => {
    setChecked(
      (currency === currencyToUse && currencyInUse !== currencyToUse)
      || (currency === currencyInUse && currencyInUse === currencyToUse)
    )
  }, [currency, currencyInUse, currencyToUse])

  let message = "Use this currency"
  if (checked) {
    if (currencyToUse === currencyInUse) message = "Using this currency"
    else message = "Will use this currency"
  }

  const handleChangeCurrency = () => {
    setChecked(true)
    dispatch(changeCurrency(currency, data))
    dispatch(showToast("You will be using this currency tomorrow."))
  }

  const dispatch = useDispatch()

  const [modal, setModal] = useState({
    shown: false,
    content: null
  });

  return (
    <>
      <IonHeader>
        <IonToolbar color={checked ? "primary" : "secondary"}>
          <IonButtons slot="start">
            <IonMenuButton menu="menu" />
          </IonButtons>
          <IonTitle>{currency}</IonTitle>
          <IonButtons slot="end">
            <IonItem color={checked ? "primary" : "warning"}>
              <IonButton
                disabled={checked}
                onClick={handleChangeCurrency}>
                {message}
              </IonButton>
            </IonItem>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonMenu menuId="menu" contentId="main">
        <IonToolbar color={checked ? "primary" : "warning"}>
          <IonButtons slot="start">
            <IonMenuButton menu="menu" />
          </IonButtons>
          <IonTitle>{currency}</IonTitle>
        </IonToolbar>

        <IonContent color="light">
          <IonList>
            <IonMenuToggle menu="menu" >
              <IonItem
                color="light"
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Currencies closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={logoUsd} color="warning" />
                Currencies
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                color="light"
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Journal closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={book} color="primary" />
                Journal
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                color="light"
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Schedules closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={calendar} color="secondary" />
                Schedules
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                color="light"
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Income closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={cash} color="success" />
                Income
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                color="light"
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Help closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon
                  slot="start"
                  icon={informationCircle}
                  color="danger"
                />
                Help
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonRouterOutlet id="main" />
      <IonModal
        isOpen={modal.shown}
        onDidDismiss={() => setModal({ shown: false })}>
        {modal.content}
      </IonModal>
    </>
  )
}

export default Header
