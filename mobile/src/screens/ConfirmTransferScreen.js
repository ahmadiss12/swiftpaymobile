import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

const ConfirmTransferScreen = ({ navigation, route }) => {
  const {
    recipientIdentifier,
    recipientName,
    recipientType,
    amount,
    message,
  } = route.params;
  const { user, updateBalance } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      const result = await apiService.sendMoney({
        recipient_identifier: recipientIdentifier,
        amount,
        message,
      });

      const nextBalance = result.new_balance ?? (Number(user?.balance || 0) - amount);
      updateBalance(nextBalance);

      navigation.replace('TransferSuccess', {
        recipient: result.transaction.recipient,
        amount,
        transactionId: result.transaction.id,
      });
    } catch (error) {
      Alert.alert('Transfer Failed', error.message || 'Unable to complete this transfer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Confirm Transfer</Text>
        <Text style={styles.subtitle}>Review the details before sending.</Text>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>You are sending</Text>
          <Text style={styles.amount}>${Number(amount).toFixed(2)}</Text>
          <Text style={styles.recipient}>{recipientName}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recipient</Text>
            <Text style={styles.detailValue}>{recipientName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{recipientType}</Text>
            <Text style={styles.detailValue}>{recipientIdentifier}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transfer Amount</Text>
            <Text style={styles.detailValue}>${Number(amount).toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Fee</Text>
            <Text style={styles.detailValue}>$0.00</Text>
          </View>
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${Number(amount).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.messageSection}>
          <Text style={styles.messageLabel}>Message</Text>
          <Text style={styles.messageText}>{message || 'No message'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={isSubmitting}
          >
            <Text style={styles.confirmButtonText}>
              {isSubmitting ? 'Sending...' : 'Confirm & Send'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  amountLabel: {
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  recipient: {
    fontSize: 18,
    marginTop: 8,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 16,
  },
  detailLabel: {
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  messageSection: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  messageLabel: {
    fontWeight: '700',
    marginBottom: 8,
  },
  messageText: {
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.65,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmTransferScreen;
