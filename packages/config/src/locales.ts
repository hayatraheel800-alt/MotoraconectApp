export type SupportedLocale="en"|"ur";

export const SUPPORTED_LOCALES:readonly SupportedLocale[]=["en","ur"];

export const LOCALE_LABELS:Record<SupportedLocale,string>={
  en:"English",
  ur:"اردو"
};

export const messages={
  en:{
    home:"Home",
    vehicles:"Vehicles",
    sell:"Sell",
    services:"Services",
    profile:"Profile",
    auctionSheetReader:"Auction Sheet Reader",
    importCalculator:"Import Cost Calculator",
    guides:"Import & Buying Guides",
    consultation:"Consultation",
    messages:"Messages",
    payments:"Payments",
    askAi:"Ask Motoraconect AI",
    parts:"Parts Marketplace",
    dealers:"Dealers"
  },
  ur:{
    home:"ہوم",
    vehicles:"گاڑیاں",
    sell:"فروخت",
    services:"سروسز",
    profile:"پروفائل",
    auctionSheetReader:"آکشن شیٹ ریڈر",
    importCalculator:"امپورٹ لاگت کیلکولیٹر",
    guides:"امپورٹ اور خریداری گائیڈز",
    consultation:"مشاورت",
    messages:"پیغامات",
    payments:"ادائیگیاں",
    askAi:"موٹراکنیکٹ AI سے پوچھیں",
    parts:"پارٹس مارکیٹ پلیس",
    dealers:"ڈیلرز"
  }
} as const;

export function getMessages(locale:SupportedLocale){
  return messages[locale];
}
