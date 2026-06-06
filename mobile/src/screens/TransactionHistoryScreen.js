import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import apiService from '../services/apiService';

const TransactionHistoryScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 days');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getTransactions(selectedType);
      setTransactions(data.transactions || []);
    } catch (error) {
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [selectedType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#34C759';
      case 'Pending': return '#FF9500';
      case 'Failed': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.avatar,
          { backgroundColor: item.transaction_type === 'received' ? '#E3F2FD' : '#FFEBEE' }
        ]}>
          <Text style={[
            styles.avatarText,
            { color: item.transaction_type === 'received' ? '#1976D2' : '#D32F2F' }
          ]}>
            {item.other_party_name ? item.other_party_name.split(' ').map(n => n[0]).join('') : 'UU'}
          </Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>{item.other_party_name || 'Unknown User'}</Text>
          <Text style={styles.transactionDate}>
            {item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown date'}
          </Text>
          <Text style={styles.transactionId}>{item.id}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          item.transaction_type === 'received' ? styles.received : styles.sent
        ]}>
          {item.transaction_type === 'received' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>View all your transactions</Text>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.typeFilter}>
            <Text style={styles.filterLabel}>Transaction Type</Text>
            <View style={styles.filterButtons}>
              {['All', 'Sent', 'Received'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    selectedType === type && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedType === type && styles.filterButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dateFilter}>
            <Text style={styles.filterLabel}>Select Date Range</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>{selectedDateRange}</Text>
              <Icon name="keyboard-arrow-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        {isLoading ? (
          <Text style={styles.loadingText}>Loading transactions...</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id + item.transaction_type}
            scrollEnabled={false}
            style={styles.transactionsList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transactions found</Text>
            }
          />
        )}

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total Transactions Period
          </Text>
          <Text style={styles.summaryNumbers}>
            {transactions.length} • {selectedDateRange}
          </Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  filterSection: {
    marginBottom: 20,
  },
  typeFilter: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  dateFilter: {
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  transactionsList: {
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionId: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  received: {
    color: '#34C759',
  },
  sent: {
    color: '#FF3B30',
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryNumbers: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 40,
  },
});

export default TransactionHistoryScreen;
