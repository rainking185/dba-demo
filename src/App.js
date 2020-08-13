import React, { useEffect } from 'react';
import { IonToast, IonApp } from '@ionic/react';
import Summary from './pages/Summary';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAll, update } from './features/profile'
import { setCurrency, hideToast, hideAd, setShowAd } from './features/app'
import FirstForm from './pages/FirstForm'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {
  updateData, updateJournal, updateSchedules, updateIncome, updateFamily
} from './features/profile';
import { showBannerAd, removeBannerAd, hideBannerAd } from './utils/adMob';
import { L } from './utils/language';
import Loading from './pages/Loading';

const App = () => {

  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const {
    permissionDenied,
    loaded,
    data,
    income,
    journal,
    schedules,
    family
  } = profile
  const currency = useSelector(state => state.app.currency)
  const toast = useSelector(state => state.app.toast)
  const l = useSelector(state => state.profile.language)

  useEffect(() => {
    showBannerAd().then(() => dispatch(setShowAd()))
    return removeBannerAd
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!permissionDenied && !loaded) dispatch(fetchAll())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionDenied]);

  useEffect(() => {
    if (loaded && data !== null) {
      if (data.lastEdited !== new Date().toDateString()) {
        console.log("Updating daily")
        dispatch(update(data, journal, schedules, income))
      }
      else {
        console.log("Updating data")
        dispatch(updateData(data))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (loaded && data !== null) {
      console.log("Updating journal")
      dispatch(updateJournal(journal))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal]);

  useEffect(() => {
    if (loaded && data !== null) {
      console.log("Updating schedules")
      dispatch(updateSchedules(schedules))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  useEffect(() => {
    if (loaded && data !== null) {
      console.log("Updating income")
      dispatch(updateIncome(income))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income]);

  useEffect(() => {
    if (loaded && data !== null) {
      console.log("Updating family")
      dispatch(updateFamily(family))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [family]);

  let main = null
  if (permissionDenied) {
    main = <Loading failed={true} />
  }
  else {
    if (!loaded) main = <Loading />
    else if (data === null) main = <FirstForm />
    else if (data !== null && loaded && currency === "") {
      dispatch(setCurrency(data.currencyToUse))
      main = <Loading />
    } else main = <Summary />
  }

  const showAd = useSelector(state => state.app.showAd)

  const hideBanner = () => {
    hideBannerAd()
    dispatch(hideAd())
  }

  return (
    <>
      <IonApp color="light">
        {main}
        <IonToast
          color="dark"
          isOpen={toast.shown}
          onDidDismiss={() => dispatch(hideToast())}
          message={toast.message}
          duration={1000} />

      </IonApp>
      {showAd
        ? <button className="ad-close" onClick={hideBanner}>
          X {L("Close Ad", l)}
        </button>
        : null}
    </>
  )
}

export default App;

