# Universal Links — iOS + Android App Links

Habilita abrir `https://farmei.app/invite/<token>` direto no app Farmei em vez do navegador.

A API hospeda os dois manifestos automaticamente em:

- `https://farmei.app/.well-known/apple-app-site-association` (iOS, **sem extensão**, `Content-Type: application/json`)
- `https://farmei.app/.well-known/assetlinks.json` (Android)

## 1. Configurar variáveis no servidor

Definir no ambiente onde a API roda (Vercel/Render/Railway/etc):

| Variável | Onde obter |
|---|---|
| `APP_BUNDLE_ID` | Constante: `app.farmei.mobile` |
| `APPLE_TEAM_ID` | https://developer.apple.com → Account → Membership → Team ID |
| `ANDROID_SHA256_CERT_FINGERPRINT` | Fingerprint SHA-256 do keystore usado pelo build (ver abaixo) |

Para Android você precisa **de pelo menos dois fingerprints** (separados por vírgula):

1. **Debug** (gerado por `expo run:android` e EAS dev): `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA256`
2. **Produção** (gerado pelo EAS no primeiro `eas build`): `eas credentials` → escolher Android → ver fingerprint

Exemplo:
```env
ANDROID_SHA256_CERT_FINGERPRINT=AA:BB:CC:...:99,11:22:33:...:FF
```

## 2. Apontar DNS para a API

Apex `farmei.app` (ou subdomínio) precisa servir TLS válido (não auto-assinado). Vercel/Cloudflare/Render dão isso de graça.

## 3. Validar

```bash
# iOS
curl -i https://farmei.app/.well-known/apple-app-site-association
# Esperado: 200 + body JSON com applinks.details[].appID = "<TEAM>.app.farmei.mobile"

# Android
curl -i https://farmei.app/.well-known/assetlinks.json
# Esperado: 200 + JSON array com sha256_cert_fingerprints preenchido
```

**Validadores oficiais:**
- iOS: https://search.developer.apple.com/appsearch-validation-tool/
- Android: https://developers.google.com/digital-asset-links/tools/generator

## 4. App Side

Já configurado em `apps/mobile/app.json`:

```jsonc
{
  "expo": {
    "ios": { "associatedDomains": ["applinks:farmei.app"] },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "https", "host": "farmei.app", "pathPrefix": "/invite" }],
          "category": ["BROWSABLE", "DEFAULT"],
          "autoVerify": true
        }
      ]
    }
  }
}
```

## 5. Teste no dispositivo

- **iOS:** `xcrun simctl openurl booted https://farmei.app/invite/TEST` — deve abrir o app, não Safari.
- **Android:** `adb shell am start -W -a android.intent.action.VIEW -d "https://farmei.app/invite/TEST"` — verificar `Activity: app.farmei.mobile/.MainActivity`.

## Falhou? Checklist

1. AASA acessível via HTTPS sem redirect? (curl deve retornar 200, não 301)
2. `Content-Type: application/json` (não `text/plain`)?
3. iOS: deletar e reinstalar o app — AASA é cacheado pelo iOS.
4. Android: `adb shell pm verify-app-links --re-verify app.farmei.mobile` força nova verificação.
5. Fingerprint SHA-256 bate com o keystore real do APK instalado? Use `apksigner verify --print-certs <apk>` para checar.
