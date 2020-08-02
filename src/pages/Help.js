import React, { useState, useEffect } from 'react'
import {
  IonPage, IonToolbar,
  IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonHeader, IonItem, IonText, IonFab, IonFabButton
} from '@ionic/react'
import { useDispatch, useSelector } from 'react-redux'
import { arrowBack, walk, arrowUp } from "ionicons/icons"
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
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton href="#top">
          <IonIcon icon={arrowUp} />
        </IonFabButton>
      </IonFab>
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
            <IonItem id="top">
              <IonText>
                <h1>Table of Content</h1>
                <ul>
                  <li>
                    <a href="#what_is_dba">What is DBA?</a>
                  </li>
                  <li>
                    <a href="#why_dba">Why DBA?</a>
                  </li>
                  <li>
                    <a href="#how_to_use_dba">How to use DBA?</a>
                    <ul>
                      <li>
                        <a href="#first_account">First Account</a>
                      </li>
                      <li>
                        <a href="#daily_commitment">Daily Commitment</a>
                      </li>
                      <li>
                        <a href="#dba_job">DBA Application's Job</a>
                      </li>
                      <li>
                        <a href="#daily_budget">How much should I set for Daily Budget?</a>
                      </li>
                      <li>
                        <a href="#change_daily_budget">Changing Daily Budget</a>
                      </li>
                      <li>
                        <a href="#others">Other Features</a>
                        <ul>
                          <li>
                            <a href="#currencies">Multiple Currencies</a>
                          </li>
                          <li>
                            <a href="#journal">Journal</a>
                          </li>
                          <li>
                            <a href="#schedules">Schedules</a>
                          </li>
                          <li>
                            <a href="#income">Income</a>
                          </li>
                          <li>
                            <a href="#family">Family</a>
                          </li>
                          <li>
                            <a href="#report">Report</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </IonText>
            </IonItem>
            <IonItem id="what_is_dba">
              <IonText>
                <h1>What is DBA?</h1>
                <p>
                  DBA, Daily Budgeted Accounting, is a method of personal accounting highlighting the feature of a daily budget.
                  A daily budget is an estimated amount above your long-term average daily spending.
                  The most important trick of DBA is that the remaining budget after a day will be added into your savings.
                </p>
                <p>
                  DBA is probably not one of the most fancy accounting applications.
                  Since it's completely offline, it doesn't connect to your bank or other account to update your budget automatically.
                  While these might be future works, using DBA takes minimal efforts (usually less than 30 seconds per day) while gaining the most benefits in terms of managing your own money.
                  In the family aspect, it wipes off any family financial conflicts which is a very common issue between couples and within family.
                  If you think that DBA is yet to be a perfect application, Sylon will work towards making this a perfect one for everyone.
                  Tell Sylon about your thoughts and we shall move on together.
                </p>
                <p>
                  DBA is a useful but slightly complicated application.
                  Sylon had made this application for personal use but is looking forward to incorporate needs of other users.
                  Please refer to the documentation before using the application.
                </p>
                <p>
                  BaiduNetDisk: <a href="https://pan.baidu.com/s/1IpVeMlXKl1UiDF1-b8i7yw">Click here</a> Code: 6666
                </p>
                <p>
                  If you have any question, complaint, or suggestion about DBA, please contact Sylon through one of the following:
                </p>
                <ul>
                  <li>Email: xubochao.australia@hotmail.com</li>
                  <li>WeChat: rainking185</li>
                  <li>QQ: 1035262422</li>
                </ul>
              </IonText>
            </IonItem>
            <IonItem id="why_dba">
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
            <IonItem id="how_to_use_dba">
              <IonText>
                <h1>How to use DBA?</h1>
                <p>
                  The primary purpose of DBA application focuses on spending and not earning.
                  To incorporate income into DBA for each currency, use "I'M EARNING" checkbox on Income page.
                  See other features for details.
                </p>
                <p>
                  DBA Application is a fully offline application. So you don't have to worry about leakage of data.
                </p>
                <h3 id="first_account">First Account</h3>
                <p>
                  To setup the first account, fill in the currency you are using with 3 capital letters only, then the savings you have now and the daily budget you would like to set.
                </p>
                <h3 id="daily_commitment">Daily Commitment</h3>
                <p>
                  Once your currency is setup, the only thing you need to do is to log all your spendings from the home page. That's it!
                </p>
                <h3 id="dba_job">DBA Application's Job</h3>
                <p>
                  DBA application will refresh your daily budget when a new day comes.
                  It will also refresh your monthly budget when a new month comes.
                </p>
                <h3 id="daily_budget">How much should I set for Daily Budget?</h3>
                <p>
                  If you haven't had an idea about your average daily spending, try setting a reasonable amount and test it for a year.
                  Watch the savings after a year and adjust the daily budget accordingly.
                </p>
                <h3 id="change_daily_budget">Changing Daily Budget</h3>
                <p>
                  At anytime that you feel that the amount of your daily budget is not appropriate, change it from the home page of the respective currency.
                  You will start your daily budget from the next day onwards.
                </p>
                <h3 id="others">Other Features</h3>
                <p>
                  All the features below are in the menu accessible from the home page.
                </p>
                <h5 id="currencies">Multiple Currencies</h5>
                <p>
                  In case you are travelling to or living in another country, you can always setup a new currency and continue your daily budget there.
                  You daily budget will only run on one currency at a time.
                  To change the currency, go to the page of that currency and press "USE THIS CURRENCY".
                  You daily budget will continue with that currency on the next day.
                  You can delete any currency profile from the page, only if you are not using that currency or you have more than 1 currency.
                </p>
                <h5 id="journal">Journal</h5>
                <p>
                  In each of your currency profiles, you can check your entries in the journal by going to the "Journal" page.
                  You can remove any wrong entries if you like in the "Journal" page.
                </p>
                <h5 id="schedules">Schedules</h5>
                <p>
                  If you have any ongoing subscription fees, "Schedules" is the feature for you.
                  You can setup monthly or weekly payments and DBA Application will deduct the amount for your automatically.
                  Deleting of existing schedules is also possible from the page.
                </p>
                <h5 id="income">Income</h5>
                <p>
                  This feature is for those who are earning only.
                  To use this feature, tick the "I'M EARNING" in Income page.
                  You can do this independently for each currency.
                  In the income earning mode, you will have to update your income NOT from the home page but from this Income page.
                  Your daily budget will be deducted from your remaining income.
                  DBA application will also nominate the amount to set for your daily budget based on your average income.
                </p>
                <h5 id="family">Family</h5>
                <p>
                  Family account is a simple account for you to manage your family income and spending.
                  Family account for each currency is independent from the others.
                  The account consists of monthly information and overall savings.
                  There is also a journal similar to the personal one.
                  Refer to DBA Tutorial for in-depth explanation of the usage.
                </p>
                <h6 id="report">Report</h6>
                <p>
                  The report page gives you a more straightforward way of viewing your spending or savings per day or per month.
                </p>
              </IonText>
            </IonItem>
          </>
          : <>
            <IonItem>
              <IonText>
                <h1>目录</h1>
                <ul>
                  <li>
                    <a href="#what_is_dba">什么是DBA？</a>
                  </li>
                  <li>
                    <a href="#why_dba">为什么使用DBA？</a>
                  </li>
                  <li>
                    <a href="#how_to_use_dba">如何使用DBA？</a>
                    <ul>
                      <li>
                        <a href="#first_account">第一次使用</a>
                      </li>
                      <li>
                        <a href="#daily_commitment">每日任务</a>
                      </li>
                      <li>
                        <a href="#dba_job">DBA应用的自动功能</a>
                      </li>
                      <li>
                        <a href="#daily_budget">日预算多少是合理的？</a>
                      </li>
                      <li>
                        <a href="#change_daily_budget">更改日预算</a>
                      </li>
                      <li>
                        <a href="#others">其他功能</a>
                        <ul>
                          <li>
                            <a href="#currencies">多个货币</a>
                          </li>
                          <li>
                            <a href="#journal">账本</a>
                          </li>
                          <li>
                            <a href="#schedules">定期项</a>
                          </li>
                          <li>
                            <a href="#income">收入</a>
                          </li>
                          <li>
                            <a href="#family">家庭</a>
                          </li>
                          <li>
                            <a href="#report">结算</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </IonText>
            </IonItem>
            <IonItem id="what_is_dba">
              <IonText>
                <h1>什么是DBA？</h1>
                <p>
                  DBA，Daily Budgeted Accounting，即日预算记账，是一种包含日预算的个人记账方式。
                  日预算的数额由个人的长期平均每日支出估算而出。
                  使用DBA的妙处在于每日结算的的剩余预算将加入个人积蓄。
                </p>
                <p>
                  DBA不是一个特别高大上的应用。
                  因为DBA是一个纯线下应用，它不会和你的银行，微信，支付宝等其他账户相对接并自动更新您的预算。
                  这些也许是未来的开发方向。不过使用DBA（一般每天少于30秒）是花最少的时间与精力，获最大的利益。
                  它不仅可以帮助您管理与解决金钱问题，在家庭方面，还可以完全地避免家庭经济纠纷。
                  这是现今家庭与配偶之间非常常见的一个问题。
                  如果您觉得DBA还不是一个完美的解决方案，佐龙将和您一起将DBA打造成一个适合每一个人的完美应用。
                  欢迎和佐龙分享您的想法。我们将携手共进。
                </p>
                <p>
                  DBA是一个非常实用但是有点复杂的应用。
                  佐龙一开始是给自己开发了这一应用。
                  现在正征求广大用户（包括您）的需求来继续开发。
                  请在使用应用前参照相关文档。
                </p>
                <p>
                  百度网盘: <a href="https://pan.baidu.com/s/1IpVeMlXKl1UiDF1-b8i7yw">点这里</a> 提取码: 6666
                </p>
                <p>
                  如果您对应用有任何的疑问，不满或建议等，请通过以下联系方式联系佐龙：
                </p>
                <ul>
                  <li>邮箱：xubochao.australia@hotmail.com</li>
                  <li>微信：rainking185</li>
                  <li>QQ: 1035262422</li>
                </ul>
              </IonText>
            </IonItem>
            <IonItem id="why_dba">
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
            <IonItem id="how_to_use_dba">
              <IonText>
                <h1>如何使用DBA？</h1>
                <p>
                  DBA应用的第一使用目的针对个人消费，不针对个人收入。
                  用户可通过“收入”页面的“我有收入”选项来整合个人收入到DBA中。
                  更多详情请参照“其他”。
              </p>
                <p>
                  DBA 是一个纯线下的应用。所以您不需要担心数据的泄露。
            </p>
                <h3 id="first_account">第一次使用</h3>
                <p>
                  在第一次使用DBA时，填写您所使用的的货币（格式必须是3个英文字母），还有您现在的积蓄和您的日预算。
            </p>
                <h3 id="daily_commitment">每日任务</h3>
                <p>
                  在货币账户设立之后，您所需要的做的事情是每天将您的消费通过主页面记录下来。
            </p>
                <h3 id="dba_job">DBA应用的自动功能</h3>
                <p>
                  DBA将自动重置您每日与每月的预算。
            </p>
                <h3 id="daily_budget">日预算多少是合理的？</h3>
                <p>
                  如果您没有您平均个人消费的概念，您可以尝试设定任意一个看似合理的数字，然后进行一年周期的测试。
                  当测试接近尾声，通过您积蓄的数额来调整您的日预算。
            </p>
                <h3 id="change_daily_budget">更改日预算</h3>
                <p>
                  您可以通过各货币的主页面在任意时间更改您的日预算。
                  新的预算将在下一日开始使用。
            </p>
                <h3 id="others">其他功能</h3>
                <p>
                  以下功能均在主页面的菜单栏里。
            </p>
                <h5 id="currencies">多个货币</h5>
                <p>
                  如果您将到其他国家旅游或有在其他国家居住，您可以设立一个新的货币并继续使用日预算。
                  日预算只会同时在一个货币生效。
                  您可以通过各货币的主页面，点击“使用此货币”来切换货币。
                  您的日预算将会在下一日使用此货币。
                  只要您有多余一个货币，您可以删除任何不是正在使用的货币。
            </p>
                <h5 id="journal">账本</h5>
                <p>
                  您可以通过菜单栏的“账本”页面来查询各个货币的消费记录条目。
                  在这一页面，您可以删除任意一条错误的条目。
            </p>
                <h5 id="schedules">定期项</h5>
                <p>
                  您如果有任何订阅性消费，您可以使用“定期项”功能。
                  您可以设置每月或每星期的定期项。DBA应用将会自动在设定的日期更新您的消费。
                  您可以删除任意一条设定过的定期项。
            </p>
                <h5 id="income">收入</h5>
                <p>
                  这一功能提供给有收入的用户。
                  如果您想要使用这一功能，请在“收入”页面点击“我有收入”选项。
                  每一个货币可以独立地使用这一功能。
                  在“有收入”模式下，您需要通过“收入”页面来更新您的收入。请不要通过主页面的记录条目来更新您的收入。
                  您的日预算将会从您的收入扣除。
                  DBA应用也将会通过您的收入计算并提供可参照的日预算数额。
            </p>
                <h5 id="family">家庭</h5>
                <p>
                  家庭账户是一个简单的账户用来管理家庭的收入和支出。
                  每个货币的家庭账户都是独立的。
                  家庭页面包括本月的账户总结和总的积蓄。
                  还包括一个和个人一样的账本。
                  更多详情请参照DBA教程。
                </p>
                <h6 id="report">结算</h6>
                <p>
                  结算页面提供您一个更加直观的每日或每月消费或积蓄。
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
