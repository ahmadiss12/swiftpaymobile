import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

const ReceiveMoneyScreen = ({ navigation }) => {
  const { user } = useAuth();

  const recentReceipts = [
    {
      id: "1",
      name: "Alex Williams",
      amount: 150.00,
      time: "10 min ago",
      status: "completed"
    },
    {
      id: "2",
      name: "Jessica Brown",
      amount: 75.50,
      time: "1 hour ago",
      status: "completed"
    }
  ];

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(user?.swiftpay_id || 'SP-000000');
      Alert.alert('Copied', 'SwiftPay ID copied to clipboard.');
    } catch (error) {
      Alert.alert('Copy Failed', 'Unable to copy SwiftPay ID.');
    }
  };

  const swiftpayId = user?.swiftpay_id || 'SP-000000';

  const renderReceiptItem = ({ item }) => (
    <View style={styles.receiptItem}>
      <View style={styles.receiptInfo}>
        <Text style={styles.receiptName}>{item.name}</Text>
        <Text style={styles.receiptTime}>{item.time}</Text>
      </View>
      <View style={styles.receiptRight}>
        <Text style={styles.receiptAmount}>+${item.amount.toFixed(2)}</Text>
        <Text style={styles.receiptStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Receive Money</Text>
        <Text style={styles.subtitle}>Share your ID or QR code to receive payments</Text>

        {/* SwiftPay ID Card */}
        <View style={styles.idCard}>
          <Text style={styles.idLabel}>Your SwiftPay ID</Text>
          <View style={styles.idContainer}>
            <Text style={styles.idText}>{user?.swiftpay_id || 'SP-000000'}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Icon name="content-copy" size={20} color="#007AFF" />
              <Text style={styles.copyText}>Copy ID</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Scan QR Code to Pay</Text>
          <View style={styles.qrContainer}>
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={swiftpayId}
                size={200}
                color="#000000"
                backgroundColor="#ffffff"
                logo={null}
                logoSize={30}
                logoBackgroundColor="transparent"
                logoMargin={2}
                logoBorderRadius={15}
                quietZone={10}
              />
            </View>
            <Text style={styles.qrIdText}>{swiftpayId}</Text>
          </View>
          <Text style={styles.shareText}>or share your ID manually</Text>
        </View>

        {/* Request Money Button */}
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request Money</Text>
        </TouchableOpacity>

        {/* Recent Receipts */}
        <View style={styles.receiptsSection}>
          <Text style={styles.sectionTitle}>Recent Receipts</Text>
          <FlatList
            data={recentReceipts}
            renderItem={renderReceiptItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  idCard: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  idLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  idContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  qrCodeWrapper: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  qrIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  shareText: {
    fontSize: 14,
    color: '#666',
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  receiptsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  receiptInfo: {
    flex: 1,
  },
  receiptName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  receiptTime: {
    fontSize: 14,
    color: '#666',
  },
  receiptRight: {
    alignItems: 'flex-end',
  },
  receiptAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 2,
  },
  receiptStatus: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
});

export default ReceiveMoneyScreen;
