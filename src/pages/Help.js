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
  const l = useSelector(state => state.profile.language)
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
        {l === "en"
          ? <>
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
                  The primary purpose of DBA application focuses on spending and not earning.
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
          </>
          : <>
            <IonItem>
              <IonText>
                <h1>什么是DBA？</h1>
                <p>
                  DBA，Daily Budgeted Accounting，即日预算记账，是一种包含日预算的个人记账方式。
                  日预算的数额由个人的长期平均每日支出估算而出。
                  使用DBA的妙处在于每日结算的的剩余预算将加入个人积蓄。
                </p>
              </IonText>
            </IonItem>
            <IonItem>
              <IonText>
                <h1>为什么使用DBA？</h1>
                <p>
                  DBA是用来提高个人消费意识的最佳方法之一。
                  个人消费意识指的是以下几点：
                </p>
                <ol>
                  <li>
                    通过一年的时间使用DBA来得知个人的平均每日消费数额。
                  </li>
                  <li>
                    通过可查看的准确数额来提高消费信心。
                  </li>
                  <li>
                    对比个人消费与个人收入或者家庭收入来确定个人消费是否合理。
                  </li>
                </ol>
              </IonText>
            </IonItem>
            <IonItem>
              <IonText>
                <h1>如何使用DBA？</h1>
                <p>
                  DBA应用的第一使用目的针对个人消费，不针对个人收入。
                  用户可通过“收入”页面的“我有收入”选项来整合个人收入到DBA中。
                  更多详情请参照“其他”。
              <br /><br />
              DBA 是一个纯下线的应用。所以您不需要担心数据的泄露。
            </p>
                <h3>第一次使用</h3>
                <p>
                  在第一次使用DBA时，填写您所使用的的货币（格式必须是3个英文字母），还有您现在的积蓄和您的日预算。
            </p>
                <h3>每日任务</h3>
                <p>
                  在货币账户设立之后，您所需要的做的事情是每天将您的消费通过主页面记录下来。
            </p>
                <h3>DBA应用的自动功能</h3>
                <p>
                  DBA将自动重置您每日与每月的预算。
            </p>
                <h3>日预算多少是合理的？</h3>
                <p>
                  如果您没有您平均个人消费的概念，您可以尝试设定任意一个看似合理的数字，然后进行一年周期的测试。
                  当测试接近尾声，通过您积蓄的数额来调整您的日预算。
            </p>
                <h3>更改日预算</h3>
                <p>
                  您可以通过各货币的主页面在任意时间更改您的日预算。
                  新的预算将在下一日开始使用。
            </p>
                <h3>其他功能</h3>
                <p>
                  以下功能均在主页面的菜单栏里。
            </p>
                <h5>多个货币</h5>
                <p>
                  如果您将到其他国家旅游或有在其他国家居住，您可以设立一个新的货币并继续使用日预算。
                  日预算只会同时在一个货币生效。
                  您可以通过各货币的主页面，点击“使用此货币”来切换货币。
                  您的日预算将会在下一日使用此货币。
                  只要您有多余一个货币，您可以删除任何不是正在使用的货币。
            </p>
                <h5>账本</h5>
                <p>
                  您可以通过菜单栏的“账本”页面来查询各个货币的消费记录条目。
                  在这一页面，您可以删除任意一条错误的条目。
            </p>
                <h5>定期项</h5>
                <p>
                  您如果有任何订阅性消费，您可以使用“定期项”功能。
                  您可以设置每月或每星期的定期项。DBA应用将会自动在设定的日期更新您的消费。
                  您可以删除任意一条设定过的定期项。
            </p>
                <h5>收入</h5>
                <p>
                  这一功能提供给有收入的用户。
                  如果您想要使用这一功能，请在“收入”页面点击“我有收入”选项。
                  每一个货币可以独立地使用这一功能。
                  在“有收入”模式下，您需要通过“收入”页面来更新您的收入。请不要通过主页面的记录条目来更新您的收入。
                  您的日预算将会从您的收入扣除。
                  DBA应用也将会通过您的收入计算并提供可参照的日预算数额。
            </p>
              </IonText>
            </IonItem>
          </>}

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
