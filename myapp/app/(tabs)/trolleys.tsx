import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingCart, MapPin, RefreshCw, CircleAlert as AlertCircle } from 'lucide-react-native';
import { trolleyZones } from '@/components/StoreData';

export default function TrolleysScreen() {
  const [zones, setZones] = useState(trolleyZones);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = () => {
    // Simulate real-time updates
    const updatedZones = zones.map(zone => ({
      ...zone,
      availableTrolleys: Math.max(0, zone.availableTrolleys + Math.floor(Math.random() * 6) - 3)
    }));
    setZones(updatedZones);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [zones]);

  const getTrolleyStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return { status: 'good', color: '#10b981' };
    if (percentage > 30) return { status: 'moderate', color: '#f59e0b' };
    return { status: 'low', color: '#dc2626' };
  };

  const TrolleyZoneCard = ({ zone }: { zone: any }) => {
    const { status, color } = getTrolleyStatus(zone.availableTrolleys, zone.totalTrolleys);
    const percentage = Math.round((zone.availableTrolleys / zone.totalTrolleys) * 100);

    return (
      <View style={styles.zoneCard}>
        <View style={styles.zoneHeader}>
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#6b7280" />
              <Text style={styles.locationText}>{zone.location}</Text>
            </View>
          </View>
          <View style={styles.trolleyCount}>
            <Text style={[styles.availableCount, { color }]}>{zone.availableTrolleys}</Text>
            <Text style={styles.totalCount}>/{zone.totalTrolleys}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${percentage}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.percentageText}>{percentage}% available</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]}>
            {status === 'good' ? 'Well Stocked' : 
             status === 'moderate' ? 'Moderate Stock' : 'Low Stock'}
          </Text>
          {status === 'low' && (
            <AlertCircle size={16} color={color} style={{ marginLeft: 8 }} />
          )}
        </View>
      </View>
    );
  };

  const totalAvailable = zones.reduce((sum, zone) => sum + zone.availableTrolleys, 0);
  const totalTrolleys = zones.reduce((sum, zone) => sum + zone.totalTrolleys, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ea580c', '#dc2626']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Trolley Management</Text>
        <Text style={styles.headerSubtitle}>Real-time availability tracking</Text>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <ShoppingCart size={24} color="#ea580c" />
          <Text style={styles.summaryNumber}>{totalAvailable}</Text>
          <Text style={styles.summaryLabel}>Available Trolleys</Text>
        </View>
        <View style={styles.summaryCard}>
          <RefreshCw size={24} color="#059669" />
          <Text style={styles.summaryNumber}>{totalTrolleys - totalAvailable}</Text>
          <Text style={styles.summaryLabel}>In Use</Text>
        </View>
      </View>

      <View style={styles.lastUpdatedContainer}>
        <Text style={styles.lastUpdatedText}>
          Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
          <RefreshCw size={16} color="#059669" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.zonesContainer}>
        <Text style={styles.sectionTitle}>Trolley Zones</Text>
        <View style={styles.zonesGrid}>
          {zones.map((zone) => (
            <TrolleyZoneCard key={zone.id} zone={zone} />
          ))}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Collection Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Main entrance has the most trolleys available</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Grocery section trolleys are closer to food aisles</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Parking lot trolleys are being collected regularly</Text>
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
    color: '#fed7aa',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  lastUpdatedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  refreshButton: {
    padding: 8,
  },
  zonesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  zonesGrid: {
    gap: 16,
  },
  zoneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    flex: 1,
  },
  trolleyCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  availableCount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  totalCount: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
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
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  tipsContainer: {
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
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});