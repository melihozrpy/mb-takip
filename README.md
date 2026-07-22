# MB Takip

Local server veya Lovable preview adresine bagli olmayan Expo uygulamasi.
Liste verileri telefonda kalici saklanir.

## Çalıştırma

```bash
npm install
npx expo start
```

Terminalde QR kod çıkınca iPhone'da Expo Go ile okut.

## Notlar

- Bu yapı Expo Go ile test/kullanım içindir.
- Telefona local server baglantisi olmadan kurulacak iOS uygulamasi icin EAS Build kullan:

```bash
npx eas login
npx eas build:configure
npx eas build --platform ios --profile preview
```

- Cihazlar arasi senkronizasyon veya hesap sistemi istenirse cloud backend eklenmelidir.
