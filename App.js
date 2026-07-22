import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

const APP_URL = 'https://preview--track-my-way-13.lovable.app';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);

  const reload = () => {
    setHasError(false);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri"
          disabled={!canGoBack}
          onPress={() => webViewRef.current?.goBack()}
          style={[styles.iconButton, !canGoBack && styles.disabledButton]}
        >
          <Text style={styles.iconText}>‹</Text>
        </Pressable>

        <Text numberOfLines={1} style={styles.title}>
          Track My Way
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yenile"
          onPress={reload}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>↻</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {hasError ? (
          <View style={styles.errorState}>
            <Text style={styles.errorTitle}>Sayfa açılamadı</Text>
            <Text style={styles.errorText}>
              İnternet bağlantını veya hedef adresi kontrol edip tekrar dene.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={reload}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Tekrar dene</Text>
            </Pressable>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: APP_URL }}
            originWhitelist={['https://*']}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            allowsBackForwardNavigationGestures
            startInLoadingState
            onError={() => setHasError(true)}
            onHttpError={(event) => {
              if (event.nativeEvent.statusCode >= 500) {
                setHasError(true);
              }
            }}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
            renderLoading={() => (
              <View style={styles.loading}>
                <ActivityIndicator color="#0f766e" size="large" />
              </View>
            )}
            style={styles.webView}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#d9e2ec',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 12
  },
  iconButton: {
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: 'center',
    width: 42
  },
  disabledButton: {
    opacity: 0.35
  },
  iconText: {
    color: '#0f172a',
    fontSize: 26,
    lineHeight: 28
  },
  title: {
    color: '#0f172a',
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center'
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  webView: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent: 'center'
  },
  errorState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  errorTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center'
  },
  errorText: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    minWidth: 132,
    paddingHorizontal: 18,
    paddingVertical: 11
  },
  retryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center'
  }
});
