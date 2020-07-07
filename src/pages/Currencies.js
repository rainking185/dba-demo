import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  IonPage, IonItem, IonLabel, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonText,
  IonPopover,
  IonContent,
  IonList,
  IonCard,
  IonReorderGroup,
  IonReorder
} from '@ionic/react'
import {
  arrowBack, trash, checkmark, create, time, eye, menu
} from "ionicons/icons"
import { setCurrency, showToast } from "../features/app"
import { deleteCurrency, reorderCurrency } from "../features/profile"
import { getCurrenciesSummary } from "../features/profile/utils"
import CurrencyForm from '../components/CurrencyForm'

const Currencies = (props) => {
  const { closeHandler } = props
  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const data = profile.data
  const [editing, setEditing] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [currencySelected, setCurrencySelected] = useState("");
  const currencyDisplaying = useSelector(state => state.app.currency)
  const currenciesInProfile = useSelector(
    state => state.profile.data.profile.currencies
  )
  const currencyToUse = useSelector(
    state => state.profile.data.profile.currencyToUse
  )
  const currencies = getCurrenciesSummary(currenciesInProfile)

  const handleChangeCurrency = (currency) => {
    dispatch(setCurrency(currency))
    closeHandler()
  }

  const handleDeleteCurrency = () => {
    if (Object.keys(currencies).length <= 1) {
      dispatch(showToast("You cannot delete the last currency you have."))
    } else if (currencySelected === profile.data.profile.currencyToUse) {
      dispatch(showToast("You cannot delete the currency you are using."))
    } else {
      dispatch(setCurrency(currencyToUse))
      dispatch(deleteCurrency(currencySelected, profile))
      dispatch(showToast("Currency deleted."))
    }
    setShowPopover(false)
  }

  const handleBack2Summary = () => {
    if (!Object.keys(currenciesInProfile).includes(currencyDisplaying)) {
      dispatch(setCurrency(profile.data.profile.currencyToUse))
    }
    closeHandler()
  }

  const Icons = (props) => {
    const { currency } = props

    var icon = undefined

    if (profile.data.profile.currencyInUse
      === profile.data.profile.currencyToUse) {
      if (currency === profile.data.profile.currencyInUse) icon = checkmark
    } else {
      if (currency === profile.data.profile.currencyInUse) icon = time
      else if (currency === profile.data.profile.currencyToUse)
        icon = checkmark
    }

    var color = undefined

    if (icon === checkmark) color = "primary"
    else if (icon === time) color = "warning"

    return <IonIcon slot="start" icon={icon} color={color} />
  }

  return (
    <IonPage>
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

      <IonContent>
        <IonList>
          <IonReorderGroup
            disabled={!editing}
            onIonItemReorder={
              (e) => {
                e.detail.complete(true)
                dispatch(reorderCurrency(e.detail.from, e.detail.to, data))
              }}>
            {currencies.map(currency => {
              return (
                <IonItem
                  button={!editing}
                  key={currency.name}
                  onClick={editing
                    ? null
                    : () => handleChangeCurrency(currency.name)}
                >
                  <Icons currency={currency.name} />
                  <IonLabel>
                    {currency.name}
                  </IonLabel>
                  {currency.name === currencyDisplaying
                    ? <IonIcon icon={eye} />
                    : null}
                  <IonText slot="end" color={currency.savings < 0
                    ? "danger"
                    : undefined}>
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
                  {editing
                    ? <IonReorder slot="end">
                      <IonIcon icon={menu} />
                    </IonReorder>
                    : null}
                </IonItem>
              )
            })}
          </IonReorderGroup>
        </IonList>
      </IonContent>
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={e => setShowPopover(false)}
        class="popover"
      >
        <IonCard class="ion-padding">
          <IonText>
            Are you sure you want to delete {currencySelected}?
          <br />
          This action is not reversible.
          </IonText>
          <IonItem lines="none">
            <IonButton
              slot="end"
              onClick={handleDeleteCurrency}>
              Yes
             </IonButton>
            <IonButton
              slot="end"
              onClick={() => setShowPopover(false)}>
              No
            </IonButton>
          </IonItem>
        </IonCard>
      </IonPopover>
      <CurrencyForm />
    </IonPage>
  )
}

export default Currencies
