import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

const quickAmounts = [10, 50, 100, 500];

function validateRecipient(identifier) {
  const trimmed = identifier.trim();

  if (!trimmed) {
    return { valid: false, error: 'Recipient identifier is required' };
  }

  if (/^SP-\d{6}$/i.test(trimmed)) {
    return { valid: true, type: 'SwiftPay ID' };
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: true, type: 'email address' };
  }

  if (/^\+?[0-9\s().-]{7,20}$/.test(trimmed)) {
    return { valid: true, type: 'phone number' };
  }

  return {
    valid: false,
    error: 'Enter a valid SwiftPay ID, email address, or phone number.',
  };
}

const SendMoneyScreen = ({ navigation }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleRecipientChange = (text) => {
    setRecipient(text);
    setRecipientError('');
  };

  const handleContinue = async () => {
    setRecipientError('');

    const recipientValidation = validateRecipient(recipient);
    if (!recipientValidation.valid) {
      setRecipientError(recipientValidation.error);
      return;
    }

    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than zero.');
      return;
    }

    if (Number(user?.balance || 0) < amountNumber) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance for this transfer.');
      return;
    }

    setIsLoading(true);
    try {
      const lookup = await apiService.getUserByIdentifier(recipient.trim());
      navigation.navigate('ConfirmTransfer', {
        recipientIdentifier: recipient.trim(),
        recipientName: lookup.user.full_name,
        recipientType: recipientValidation.type,
        amount: amountNumber,
        message: message.trim(),
      });
    } catch (error) {
      const type = recipientValidation.type || 'recipient';
      const fallback = `No user was found for that ${type}.`;
      setRecipientError(error.message || fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>Find a recipient and confirm the transfer.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Recipient ID / Phone / Email</Text>
          <TextInput
            style={[styles.input, recipientError && styles.inputError]}
            placeholder="SP-123456, email, or phone"
            value={recipient}
            onChangeText={handleRecipientChange}
            editable={!isLoading}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {recipientError ? (
            <Text style={styles.errorText}>{recipientError}</Text>
          ) : (
            <Text style={styles.hintText}>Use a SwiftPay ID, email address, or phone number.</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            editable={!isLoading}
          />
        </View>

        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => setAmount(String(quickAmount))}
              disabled={isLoading}
            >
              <Text style={styles.quickAmountText}>${quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Optional note"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>{isLoading ? 'Checking...' : 'Continue'}</Text>
        </TouchableOpacity>

        <Text style={styles.balanceText}>
          Available balance: ${Number(user?.balance || 0).toFixed(2)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 6,
    fontSize: 13,
  },
  hintText: {
    color: '#666',
    marginTop: 6,
    fontSize: 13,
  },
  messageInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  quickAmountText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonDisabled: {
    opacity: 0.65,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
});

export default SendMoneyScreen;
