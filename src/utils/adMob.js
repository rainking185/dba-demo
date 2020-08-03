import { Plugins } from '@capacitor/core'
import { AdSize, AdPosition } from 'capacitor-admob'

const { AdMob, SplashScreen } = Plugins

AdMob.initialize('ca-app-pub-6356796535168392~4464957723')

const bannerOption = {
  // adId: 'ca-app-pub-3940256099942544/6300978111', // Test
  adId: 'ca-app-pub-6356796535168392/7829487665',
  adSize: AdSize.SMART_BANNER,
  position: AdPosition.BOTTOM_CENTER,
  hasTabBar: true,
  tabBarHeight: 0
};

const interstitialOption = {
  // adId: 'ca-app-pub-3940256099942544/8691691433', // Test Video
  // adId: 'ca-app-pub-3940256099942544/1033173712', // Test Not Video
  adId: 'ca-app-pub-6356796535168392/5233391715', // Production
  autoShow: false
}

const rewardOption = {
  adId: 'ca-app-pub-3940256099942544/5224354917'//Test
}

export const showBannerAd = () => {
  return AdMob.showBanner(bannerOption)
}

export const hideBannerAd = () => {
  return AdMob.hideBanner()
}

export const removeBannerAd = () => {
  return AdMob.removeBanner()
}

export const prepareInterstitialAd = () => {
  return AdMob.prepareInterstitial(interstitialOption)
}

export const showInterstitialAd = () => {
  return AdMob.showInterstitial()
}

export const prepareAndShowInterstitialAd = () => {
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
}

export const showRewardAd = () => {
  AdMob.prepareRewardVideoAd(rewardOption)
    .then(
      () => AdMob.showRewardVideoAd(),
      e => console.error(e)
    )
}