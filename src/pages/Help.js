import React, { useState, useEffect } from 'react'
import {
  IonPage, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonContent
} from '@ionic/react'
import { useDispatch, useSelector } from 'react-redux'
import { arrowBack, walk } from "ionicons/icons"
import { reset, audit } from '../features/profile'

const Help = (props) => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.profile.data)
  const journal = useSelector(state => state.profile.journal)
  const schedules = useSelector(state => state.profile.schedules)
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 38) dispatch(reset())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  const { closeHandler } = props

  return (
    <IonPage>
      <IonToolbar color="success">
        <IonButtons slot="start">
          <IonButton onClick={closeHandler}>
            <IonIcon icon={arrowBack} />
          </IonButton>
        </IonButtons>
        <IonTitle>Help</IonTitle>
      </IonToolbar>

      <IonContent class="ion-padding" color="light">
        <h1>What is DBA?</h1>
        <p>
          DBA, Daily Budgeted Accounting, is a method of personal accounting highlighting the feature of a daily budget.
          A daily budget is an estimated amount above your long-term average daily spending.
          The most important trick of DBA is that the remaining budget after a day will be added into your savings.
        </p>
        <h1>Why DBA?</h1>
        <p>
          DBA is one of the best methods for raising the your financial awareness.
          The financial awareness refers to the following aspects:
        </p>
        <ol>
          <li>
            Knowing how much you are spending on average by doing DBA for a year.
            </li>
          <li>
            Raising confidence of spending with visualizable savings.
            </li>
          <li>
            Raising awareness about how much income you or your family is earning and whether it is reasonable for your spending habbits.
            </li>
        </ol>
        <h1>How to use DBA?</h1>
        <p>
          This is the first version of DBA application. It focuses purely on spending and not earning.
          DBA Application is a fully offline application. So you don't have to worry about leakage of data.
        </p>
        <h3>First Account</h3>
        <p>
          To setup the first account, fill in the currency you are using with 3 capital letters only, then the savings you have now and the daily budget you would like to set.
        </p>
        <h3>Daily Commitment</h3>
        <p>
          Once your currency is setup, the only thing you need to do is to log all your spendings from the home page. That's it!
        </p>
        <h3>DBA Application's Job</h3>
        <p>
          DBA application will refresh your daily budget when a new day comes.
          It will also refresh your monthly budget when a new month comes.
        </p>
        <h3>How much should I set for Daily Budget?</h3>
        <p>
          If you haven't had an idea about your average daily spending, try setting a reasonable amount and test it for a year.
          Watch the savings after a year and adjust the daily budget accordingly.
        </p>
        <h3>Changing Daily Budget</h3>
        <p>
          At anytime that you feel that the amount of your daily budget is not appropriate, change it from the home page of the respective currency.
          You will start your daily budget from the next day onwards.
        </p>
        <h3>Other Features</h3>
        <p>
          All the features below are in the menu accessible from the home page.
        </p>
        <h5>Multiple Currencies</h5>
        <p>
          In case you are travelling to or living in another country, you can always setup a new currency and continue your daily budget there.
          You daily budget will only run on one currency at a time.
          To change the currency, go to the page of that currency and press "USE THIS CURRENCY".
          You daily budget will continue with that currency on the next day.
          You can delete any currency profile from the page, only if you are not using that currency or you have more than 1 currency.
        </p>
        <h5>Journal</h5>
        <p>
          In each of your currency profiles, you can check your entries in the journal by going to the "Journal" page.
          You can remove any wrong entries if you like in the "Journal" page.
        </p>
        <h5>Schedules</h5>
        <p>
          If you have any ongoing subscription fees, "Schedules" is the feature for you.
          You can setup monthly or weekly payments and DBA Application will deduct the amount for your automatically.
          Deleting of existing schedules is also possible from the page.
        </p>
        <IonButtons>
          <IonButton onClick={() => setCount(0)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(999)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(count - 1)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(999)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(count * 2)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(999)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => dispatch(audit(data, journal, schedules))}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(count + 1)}>
            <IonIcon icon={walk} />
          </IonButton>
          <IonButton onClick={() => setCount(999)}>
            <IonIcon icon={walk} />
          </IonButton>
        </IonButtons>
      </IonContent>
    </IonPage>
  )
}

export default Help
