# Configuração do Firebase para iOS e Android

## ✅ Status da Configuração

O Firebase está **totalmente configurado** e funcionando para ambas as plataformas:

- ✅ **iOS**: Configurado com `GoogleService-Info.plist`
- ✅ **Android**: Configurado com `google-services.json`
- ✅ **Serviços ativos**: Auth, Firestore, Storage, Crashlytics
- ✅ **Compatibilidade**: Expo 53 + React Native 0.79

## 📱 Configurações por Plataforma

### iOS
- **Bundle ID**: `com.akomatec.tsdm`
- **Arquivo de configuração**: `GoogleService-Info.plist`
- **Plugin**: `@react-native-firebase/app`

### Android
- **Package Name**: `com.akomatec.tsdm`
- **Arquivo de configuração**: `google-services.json`
- **Plugin**: `@react-native-firebase/app`

## 🔧 Serviços Disponíveis

### 1. Authentication
```typescript
import { auth } from './firebase/config';

// Login anônimo
const signInAnonymously = async () => {
  try {
    await auth().signInAnonymously();
    console.log('Login realizado!');
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Listener de estado
auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('Usuário logado:', user.uid);
  } else {
    console.log('Usuário deslogado');
  }
});
```

### 2. Firestore
```typescript
import { firestore } from './firebase/config';

// Adicionar documento
const addDocument = async () => {
  try {
    const docRef = await firestore().collection('users').add({
      name: 'João',
      email: 'joao@example.com',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Documento criado:', docRef.id);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Buscar documentos
const getDocuments = async () => {
  try {
    const snapshot = await firestore().collection('users').get();
    snapshot.forEach(doc => {
      console.log(doc.id, doc.data());
    });
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### 3. Storage
```typescript
import { storage } from './firebase/config';

// Upload de arquivo
const uploadFile = async (filePath: string) => {
  try {
    const reference = storage().ref('uploads/image.jpg');
    await reference.putFile(filePath);
    const downloadURL = await reference.getDownloadURL();
    console.log('URL do arquivo:', downloadURL);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### 4. Crashlytics
```typescript
import { crashlytics } from './firebase/config';

// Registrar erro
const logError = (error: Error) => {
  crashlytics().recordError(error);
};

// Registrar log personalizado
const logCustomEvent = () => {
  crashlytics().log('Evento personalizado executado');
  crashlytics().setAttribute('feature', 'custom_logging');
};
```

## 🚀 Como Testar

1. **Componente de Exemplo**: Use o `FirebaseExample.tsx` para testar todos os serviços
2. **Expo Go**: Escaneie o QR code para testar no dispositivo
3. **Web**: Acesse `http://localhost:8081` para testar no navegador

## 📋 Versões Utilizadas

- `@react-native-firebase/app`: 19.2.2
- `@react-native-firebase/auth`: 19.2.2
- `@react-native-firebase/firestore`: 19.2.2
- `@react-native-firebase/storage`: 19.2.2
- `@react-native-firebase/crashlytics`: 19.2.2
- `expo`: ~53.0.0
- `react-native`: 0.79.6

## ⚠️ Notas Importantes

1. **Plugins**: Apenas `@react-native-firebase/app` e `@react-native-firebase/crashlytics` estão como plugins no `app.json`
2. **Metro Config**: Configurado para resolver problemas de importação ES modules
3. **Compatibilidade**: Versões específicas do Firebase para compatibilidade com Expo 53
4. **Bundle IDs**: Certificar que os IDs no `app.json` coincidem com os arquivos de configuração do Firebase

## 🔄 Para Builds de Produção

Quando for fazer build para produção:

```bash
# Para Android
eas build --platform android

# Para iOS
eas build --platform ios

# Para ambos
eas build --platform all
```

O Firebase funcionará automaticamente nos builds de produção com as configurações atuais.