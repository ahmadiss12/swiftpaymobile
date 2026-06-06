import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';

import ErrorBoundary from './src/components/ErrorBoundary';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import ConfirmTransferScreen from './src/screens/ConfirmTransferScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import LoginScreen from './src/screens/LoginScreen';
import ReceiveMoneyScreen from './src/screens/ReceiveMoneyScreen';
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import SignupScreen from './src/screens/SignupScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import TransferSuccessScreen from './src/screens/TransferSuccessScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 10, color: '#666' }}>Loading SwiftPay...</Text>
    </View>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerShown: false, title: 'Dashboard' }}
            />
            <Stack.Screen name="SendMoney" component={SendMoneyScreen} options={{ title: 'Send Money' }} />
            <Stack.Screen
              name="ConfirmTransfer"
              component={ConfirmTransferScreen}
              options={{ title: 'Confirm Transfer' }}
            />
            <Stack.Screen
              name="TransferSuccess"
              component={TransferSuccessScreen}
              options={{ title: 'Success', headerLeft: () => null }}
            />
            <Stack.Screen
              name="TransactionHistory"
              component={TransactionHistoryScreen}
              options={{ title: 'Transaction History' }}
            />
            <Stack.Screen name="ReceiveMoney" component={ReceiveMoneyScreen} options={{ title: 'Receive Money' }} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Help & Support' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ErrorBoundary>
  );
}
