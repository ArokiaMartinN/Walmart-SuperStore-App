import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, MapPin, Coffee, CircleHelp as HelpCircle, RefreshCw } from 'lucide-react-native';
import { seatingAreas } from '@/components/StoreData';

export default function SeatingScreen() {
  const [areas, setAreas] = useState(seatingAreas);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const updatedAreas = areas.map(area => {
        const change = Math.floor(Math.random() * 4) - 2; // -2 to 2
        return {
          ...area,
          occupiedSeats: Math.max(0, Math.min(area.totalSeats, area.occupiedSeats + change))
        };
      });
      setAreas(updatedAreas);
      setLastUpdated(new Date());
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, [areas]);

  const getOccupancyColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage < 50) return '#10b981';
    if (percentage < 80) return '#f59e0b';
    return '#dc2626';
  };

  const getAreaIcon = (type: string) => {
    switch (type) {
      case 'food-court': return <Coffee size={20} color="#059669" />;
      case 'customer-service': return <HelpCircle size={20} color="#0284c7" />;
      case 'rest-area': return <Users size={20} color="#7c3aed" />;
      default: return <Users size={20} color="#6b7280" />;
    }
  };

  const SeatingAreaCard = ({ area }: { area: any }) => {
    const occupancyPercentage = Math.round((area.occupiedSeats / area.totalSeats) * 100);
    const availableSeats = area.totalSeats - area.occupiedSeats;
    const occupancyColor = getOccupancyColor(area.occupiedSeats, area.totalSeats);

    return (
      <View style={styles.areaCard}>
        <View style={styles.areaHeader}>
          <View style={styles.areaInfo}>
            <View style={styles.areaNameRow}>
              {getAreaIcon(area.type)}
              <Text style={styles.areaName}>{area.name}</Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#6b7280" />
              <Text style={styles.locationText}>{area.location}</Text>
            </View>
          </View>
          <View style={styles.availabilityInfo}>
            <Text style={[styles.availableCount, { color: occupancyColor }]}>
              {availableSeats}
            </Text>
            <Text style={styles.availableLabel}>available</Text>
          </View>
        </View>

        <View style={styles.occupancyContainer}>
          <View style={styles.occupancyBar}>
            <View style={styles.occupancyBackground}>
              <View 
                style={[
                  styles.occupancyFill, 
                  { width: `${occupancyPercentage}%`, backgroundColor: occupancyColor }
                ]} 
              />
            </View>
            <Text style={styles.occupancyText}>
              {area.occupiedSeats}/{area.totalSeats} seats occupied ({occupancyPercentage}%)
            </Text>
          </View>
        </View>

        <View style={styles.seatGrid}>
          {Array.from({ length: Math.min(area.totalSeats, 24) }, (_, i) => (
            <View
              key={i}
              style={[
                styles.seatIndicator,
                i < area.occupiedSeats 
                  ? { backgroundColor: '#dc2626' }
                  : { backgroundColor: '#10b981' }
              ]}
            />
          ))}
          {area.totalSeats > 24 && (
            <Text style={styles.moreSeatsText}>+{area.totalSeats - 24} more</Text>
          )}
        </View>
      </View>
    );
  };

  const totalSeats = areas.reduce((sum, area) => sum + area.totalSeats, 0);
  const totalOccupied = areas.reduce((sum, area) => sum + area.occupiedSeats, 0);
  const totalAvailable = totalSeats - totalOccupied;

  const refreshData = () => {
    const updatedAreas = areas.map(area => ({
      ...area,
      occupiedSeats: Math.max(0, area.occupiedSeats + Math.floor(Math.random() * 6) - 3)
    }));
    setAreas(updatedAreas);
    setLastUpdated(new Date());
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7c3aed', '#a855f7']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Seating Areas</Text>
        <Text style={styles.headerSubtitle}>Real-time availability tracking</Text>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Users size={24} color="#10b981" />
          <Text style={styles.summaryNumber}>{totalAvailable}</Text>
          <Text style={styles.summaryLabel}>Available Seats</Text>
        </View>
        <View style={styles.summaryCard}>
          <Users size={24} color="#dc2626" />
          <Text style={styles.summaryNumber}>{totalOccupied}</Text>
          <Text style={styles.summaryLabel}>Occupied Seats</Text>
        </View>
        <View style={styles.summaryCard}>
          <Users size={24} color="#7c3aed" />
          <Text style={styles.summaryNumber}>{totalSeats}</Text>
          <Text style={styles.summaryLabel}>Total Capacity</Text>
        </View>
      </View>

      <View style={styles.lastUpdatedContainer}>
        <Text style={styles.lastUpdatedText}>
          Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
          <RefreshCw size={16} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.areasContainer}>
        <Text style={styles.sectionTitle}>Seating Areas</Text>
        <View style={styles.areasGrid}>
          {areas.map((area) => (
            <SeatingAreaCard key={area.id} area={area} />
          ))}
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Seating Legend</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.seatIndicator, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Available Seat</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.seatIndicator, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.legendText}>Occupied Seat</Text>
            </View>
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Seating Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Food court is busiest during lunch hours (12-2 PM)</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Customer service area has shorter wait times</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Rest areas near restrooms are convenient for families</Text>
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
  areasContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  areasGrid: {
    gap: 16,
  },
  areaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  areaInfo: {
    flex: 1,
  },
  areaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  areaName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
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
  availabilityInfo: {
    alignItems: 'center',
  },
  availableCount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  availableLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  occupancyContainer: {
    marginBottom: 16,
  },
  occupancyBar: {
    marginBottom: 8,
  },
  occupancyBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    borderRadius: 4,
  },
  occupancyText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  seatIndicator: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  moreSeatsText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
  },
  legendContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
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
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
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