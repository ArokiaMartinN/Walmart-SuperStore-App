import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Clock, Users, Zap, X } from 'lucide-react-native';
import { billingCounters } from '@/components/StoreData';

export default function BillingScreen() {
  const [counters, setCounters] = useState(billingCounters);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const updatedCounters = counters.map(counter => {
        if (counter.isActive) {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          return {
            ...counter,
            currentCustomers: Math.max(0, Math.min(8, counter.currentCustomers + change)),
            averageWaitTime: Math.max(0, counter.averageWaitTime + Math.floor(Math.random() * 6) - 3)
          };
        }
        return counter;
      });
      setCounters(updatedCounters);
      setLastUpdated(new Date());
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [counters]);

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 5) return '#10b981';
    if (waitTime <= 10) return '#f59e0b';
    return '#dc2626';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#10b981';
      case 'express': return '#0284c7';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const BillingCounterCard = ({ counter }: { counter: any }) => {
    const waitTimeColor = getWaitTimeColor(counter.averageWaitTime);
    const statusColor = getStatusColor(counter.status);

    return (
      <View style={[
        styles.counterCard,
        !counter.isActive && styles.counterCardInactive
      ]}>
        <View style={styles.counterHeader}>
          <View style={styles.counterInfo}>
            <Text style={styles.counterNumber}>Counter {counter.counterNumber}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {counter.status.toUpperCase()}
              </Text>
              {counter.status === 'express' && (
                <Zap size={14} color={statusColor} style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>
          {!counter.isActive && (
            <X size={20} color="#6b7280" />
          )}
        </View>

        {counter.isActive && (
          <>
            <View style={styles.counterStats}>
              <View style={styles.statItem}>
                <Users size={18} color="#6b7280" />
                <Text style={styles.statNumber}>{counter.currentCustomers}</Text>
                <Text style={styles.statLabel}>in queue</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={18} color={waitTimeColor} />
                <Text style={[styles.statNumber, { color: waitTimeColor }]}>
                  {counter.averageWaitTime}
                </Text>
                <Text style={styles.statLabel}>min wait</Text>
              </View>
            </View>

            <View style={styles.queueIndicator}>
              <Text style={styles.queueText}>Queue Status</Text>
              <View style={styles.queueDots}>
                {Array.from({ length: 8 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.queueDot,
                      i < counter.currentCustomers 
                        ? { backgroundColor: waitTimeColor }
                        : { backgroundColor: '#e5e7eb' }
                    ]}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    );
  };

  const activeCounters = counters.filter(c => c.isActive);
  const totalCustomers = activeCounters.reduce((sum, c) => sum + c.currentCustomers, 0);
  const averageWaitTime = Math.round(
    activeCounters.reduce((sum, c) => sum + c.averageWaitTime, 0) / activeCounters.length
  );

  const shortestWaitCounter = activeCounters.reduce((shortest, current) => 
    current.averageWaitTime < shortest.averageWaitTime ? current : shortest
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7c3aed', '#6366f1']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Billing Counters</Text>
        <Text style={styles.headerSubtitle}>Live queue monitoring</Text>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <CreditCard size={24} color="#7c3aed" />
          <Text style={styles.summaryNumber}>{activeCounters.length}</Text>
          <Text style={styles.summaryLabel}>Active Counters</Text>
        </View>
        <View style={styles.summaryCard}>
          <Users size={24} color="#059669" />
          <Text style={styles.summaryNumber}>{totalCustomers}</Text>
          <Text style={styles.summaryLabel}>Total in Queue</Text>
        </View>
        <View style={styles.summaryCard}>
          <Clock size={24} color="#ea580c" />
          <Text style={styles.summaryNumber}>{averageWaitTime}</Text>
          <Text style={styles.summaryLabel}>Avg Wait (min)</Text>
        </View>
      </View>

      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationTitle}>Fastest Checkout</Text>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationText}>
            Counter {shortestWaitCounter.counterNumber} • {shortestWaitCounter.averageWaitTime} min wait
          </Text>
          <Text style={styles.recommendationSubtext}>
            {shortestWaitCounter.status === 'express' ? 'Express Lane' : 'Regular Lane'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.countersContainer}>
        <Text style={styles.sectionTitle}>All Counters</Text>
        <View style={styles.countersGrid}>
          {counters.map((counter) => (
            <BillingCounterCard key={counter.id} counter={counter} />
          ))}
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Open Counter</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#0284c7' }]} />
              <Text style={styles.legendText}>Express Lane</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#6b7280' }]} />
              <Text style={styles.legendText}>Closed</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e0e7ff',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  recommendationContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  recommendationCard: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  recommendationSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#3b82f6',
    marginTop: 2,
  },
  countersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  countersGrid: {
    gap: 16,
  },
  counterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterCardInactive: {
    opacity: 0.6,
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  counterInfo: {
    flex: 1,
  },
  counterNumber: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  counterStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  queueIndicator: {
    marginTop: 8,
  },
  queueText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
  },
  queueDots: {
    flexDirection: 'row',
    gap: 4,
  },
  queueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  legendGrid: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});