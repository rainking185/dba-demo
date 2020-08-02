import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonMenu, IonTitle, IonToolbar, IonContent, IonList,
  IonItem, IonMenuButton, IonButtons, IonIcon,
  IonMenuToggle, IonRouterOutlet, IonButton, IonModal, IonHeader
} from '@ionic/react';
import { changeCurrency, toggleLanguage } from '../features/profile'
import {
  logoUsd, book, calendar, informationCircle, cash, language, people, statsChart
} from 'ionicons/icons'
import "./Styles.css"
import Currencies from '../pages/Currencies';
import Journal from '../pages/Journal';
import Schedules from '../pages/Schedules';
import { showToast } from '../features/app';
import Help from '../pages/Help';
import Income from '../pages/Income';
import { L } from '../utils/language'
import Family from '../pages/Family';
import Report from '../pages/Report';

const Header = () => {
  const data = useSelector(state => state.profile.data)
  const currencyInUse = useSelector(
    state => state.profile.data.currencyInUse
  )
  const currencyToUse = useSelector(
    state => state.profile.data.currencyToUse
  )
  const currency = useSelector(state => state.app.currency)
  const l = useSelector(state => state.profile.language)

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

  let message = L("Use this currency", l)
  if (checked) {
    if (currencyToUse === currencyInUse) message = L("Using this currency", l)
    else message = L("Will use this currency", l)
  }

  const handleChangeCurrency = () => {
    setChecked(true)
    dispatch(changeCurrency(currency, data))
    dispatch(showToast(L("You will be using this currency tomorrow.", l)))
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

        <IonContent>
          <IonList>
            <IonMenuToggle menu="menu" >
              <IonItem
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Currencies closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={logoUsd} color="warning" />
                {L("Currencies", l)}
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Journal closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={book} color="primary" />
                {L("Journal", l)}
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Schedules closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={calendar} color="secondary" />
                {L("Schedules", l)}
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Income closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon slot="start" icon={cash} color="success" />
                {L("Income", l)}
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
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
                {L("Help", l)}
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Family closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon
                  slot="start"
                  icon={people}
                  color="tertiary"
                />
                {L("Family", l)}
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle menu="menu" >
              <IonItem
                button
                onClick={() => setModal({
                  shown: true,
                  content: <Report closeHandler={
                    () => setModal({ shown: false })
                  } />
                })}>
                <IonIcon
                  slot="start"
                  icon={statsChart}
                />
                {L("Report", l)}
              </IonItem>
            </IonMenuToggle>
            <IonItem
              button
              onClick={() => dispatch(toggleLanguage())}
            >
              <IonIcon
                slot="start"
                icon={language}
                color="dark"
              />
              {l === "en" ? "切换语言" : "Toggle Language"}
            </IonItem>
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
