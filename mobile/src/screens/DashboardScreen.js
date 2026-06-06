import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  RefreshControl
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

const DashboardScreen = ({ navigation }) => {
  const { user, updateBalance, logout } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getDashboard();
      setRecentTransactions(data.recentTransactions || []);

      // Update the user balance in auth context
      if (data.user && data.user.balance !== user?.balance) {
        updateBalance(data.user.balance);
      }
    } catch (error) {
      setRecentTransactions([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const renderTransactionItem = ({ item }) => {
    // Add safety checks for undefined values
    const amount = item?.amount || 0;
    const transactionType = item?.transaction_type || 'sent';
    const otherPartyName = item?.other_party_name || 'Unknown User';
    const createdAt = item?.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date';

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>{otherPartyName}</Text>
          <Text style={styles.transactionTime}>{createdAt}</Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          transactionType === 'received' ? styles.received : styles.sent
        ]}>
          {transactionType === 'received' ? '+' : '-'}${amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            logout();
            navigation.replace('Login');
          }}
          >
            <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
        </View>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            ${user?.balance != null ? Number(user.balance).toFixed(2) : '0.00'}
          </Text>
          <Text style={styles.growthText}>SwiftPay ID: {user?.swiftpay_id}</Text>
        </View>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SendMoney')}
          >
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReceiveMoney')}
          >
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('TransactionHistory')}
          >
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item, index) => item?.id || `transaction-${index}`}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No recent transactions</Text>
            }
          />
        </View>
        <view><text>contact us for support</text>
        <TouchableOpacity onPress={() => navigation.navigate('HelpSupport')}>
              <Text style={styles.seeAllText}>Help & Support</Text>
            </TouchableOpacity>
        </view>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
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
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  growthText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }
    })
  },
  actionText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }
    })
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionTime: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  received: {
    color: '#34C759',
  },
  sent: {
    color: '#FF3B30',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default DashboardScreen;
