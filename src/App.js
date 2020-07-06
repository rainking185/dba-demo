import React, { useEffect } from 'react';
import { IonLoading } from '@ionic/react';
import Summary from './pages/Summary';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAll, update } from './features/profile'
import { setCurrency } from './features/app'
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
// import { clearStorage } from './features/profile/storage';

const App = () => {

  const dispatch = useDispatch()
  const loaded = useSelector(state => state.profile.loaded)
  const data = useSelector(state => state.profile.data)
  const journal = useSelector(state => state.profile.journal)
  const schedules = useSelector(state => state.profile.schedules)
  const currency = useSelector(state => state.app.currency)

  useEffect(() => {
    dispatch(fetchAll())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loaded && data !== null) {
      if (data.profile.lastEdited !== new Date().toDateString()) dispatch(update(data, journal, schedules))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (!loaded) return <IonLoading message={'Loading your profile...'} />
  else if (data === null) return <FirstForm />
  else if (data !== null && loaded && currency === "") {
    dispatch(setCurrency(data.profile.currencyInUse))
    return <IonLoading message={'Loading your profile...'} />
  }

  return <Summary />
}

export default App;

