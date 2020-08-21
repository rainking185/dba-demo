import { Plugins } from '@capacitor/core'
import { AdSize, AdPosition } from 'capacitor-admob'
import { IsDebug } from "@ionic-native/is-debug";

const { AdMob, SplashScreen } = Plugins

AdMob.initialize('ca-app-pub-6356796535168392~4464957723')
  .catch(e => {
    if (e !== "AdMob does not have web implementation.")
      console.log(e)
  })

const interstitialOption = {
  // adId: 'ca-app-pub-3940256099942544/8691691433', // Test Video
  // adId: 'ca-app-pub-3940256099942544/1033173712', // Test Not Video
  adId: 'ca-app-pub-6356796535168392/5233391715', // Production
  autoShow: false
}

const rewardOption = {
  adId: 'ca-app-pub-3940256099942544/5224354917'//Test
}

const bannerTestID = 'ca-app-pub-3940256099942544/6300978111'
const bannerProductionID = 'ca-app-pub-6356796535168392/7829487665'

export const showBannerAd = async () => {
  let isDebug
  try {
    isDebug = await IsDebug.getIsDebug()
  } catch (e) {
    if (e !== "cordova_not_available") console.log(e)
    isDebug = true
  }
  const bannerOption = {
    adId: isDebug ? bannerTestID : bannerProductionID,
    adSize: AdSize.SMART_BANNER,
    position: AdPosition.BOTTOM_CENTER,
    hasTabBar: true,
    tabBarHeight: 0
  };
  return AdMob.showBanner(bannerOption)
}

export const hideBannerAd = () => {
  try {
    AdMob.hideBanner()
  } catch (e) { console.log(e) }
}

export const removeBannerAd = () => {
  try {
    AdMob.removeBanner()
  } catch (e) { console.log(e) }
}

export const prepareInterstitialAd = () =>
  AdMob.prepareInterstitial(interstitialOption)

export const showInterstitialAd = () =>
  AdMob.showInterstitial()

export const prepareAndShowInterstitialAd = () =>
  prepareInterstitialAd()
    .then(
      () => {
        showInterstitialAd().then(() => SplashScreen.hide())
      },
      e => {
        console.error(e)
        SplashScreen.hide()
      }
    )

export const showRewardAd = () =>
  AdMob.prepareRewardVideoAd(rewardOption)
    .then(
      () => AdMob.showRewardVideoAd(),
      e => console.error(e)
    )