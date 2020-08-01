import React, { useState, useEffect } from 'react'
import {
  IonPage, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonHeader, IonItem, IonText
} from '@ionic/react'
import { useDispatch, useSelector } from 'react-redux'
import { arrowBack, walk } from "ionicons/icons"
import { reset, audit } from '../features/profile'

const Help = (props) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const {
    data,
    journal,
    schedules,
    income
  } = profile
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 38) dispatch(reset())
    else if (count === 13) dispatch(audit(data, journal, schedules, income))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  const { closeHandler } = props

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonButtons slot="start">
            <IonButton onClick={closeHandler}>
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Help</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding" color="light">
        <IonItem>
          <IonText>
            <h1>What is DBA?</h1>
            <p>
              DBA, Daily Budgeted Accounting, is a method of personal accounting highlighting the feature of a daily budget.
              A daily budget is an estimated amount above your long-term average daily spending.
              The most important trick of DBA is that the remaining budget after a day will be added into your savings.
        </p>
          </IonText>
        </IonItem>
        <IonItem>
          <IonText>
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
          </IonText>
        </IonItem>
        <IonItem>
          <IonText>
            <h1>How to use DBA?</h1>
            <p>
              The primary version of DBA application focuses purely on spending and not earning.
              To incorporate income into DBA for each currency, use "I'M EARNING" checkbox on Income page.
              See other features for details.
              <br /><br />
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
            <h5>Income</h5>
            <p>
              This feature is for those who are earning only.
              To use this feature, tick the "I'M EARNING" in Income page.
              You can do this independently for each currency.
              In the income earning mode, you will have to update your income NOT from the home page but from this Income page.
              Your daily budget will be deducted from your remaining income.
              DBA application will also nominate the amount to set for your daily budget based on your average income.
            </p>
          </IonText>
        </IonItem>
        <IonItem>
          <IonButtons>
            <IonButton onClick={() => setCount(0)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
            <IonButton onClick={() => setCount(count - 1)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
            <IonButton onClick={() => setCount(999)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
            <IonButton onClick={() => setCount(count * 2)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
            <IonButton onClick={() => setCount(999)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
            <IonButton onClick={() => setCount(count + 1)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
            <IonButton onClick={() => setCount(999)}>
              <IonIcon slot="icon-only" icon={walk} />
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonContent>
    </IonPage>
  )
}

export default Help
