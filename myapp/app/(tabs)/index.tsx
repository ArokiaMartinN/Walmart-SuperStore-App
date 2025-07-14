import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Users, Clock, TrendingUp } from 'lucide-react-native';
import { storeSections, getCrowdLevel, getCrowdColor, getCrowdColorWithOpacity } from '@/components/StoreData';

const { width: screenWidth } = Dimensions.get('window');

export default function OverviewScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalPeople, setTotalPeople] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const total = storeSections.reduce((sum, section) => sum + section.peopleCount, 0);
    setTotalPeople(total);

    return () => clearInterval(timer);
  }, []);

  const totalCapacity = storeSections.reduce((sum, section) => sum + section.capacity, 0);
  const occupancyRate = Math.round((totalPeople / totalCapacity) * 100);

  const HeatMapSection = ({ section }: { section: any }) => {
    const crowdLevel = getCrowdLevel(section.peopleCount, section.capacity);
    const color = getCrowdColor(crowdLevel);
    const colorWithOpacity = getCrowdColorWithOpacity(crowdLevel, 0.7);
    
    return (
      <TouchableOpacity
        style={[
          styles.heatMapSection,
          {
            backgroundColor: colorWithOpacity,
            borderColor: color,
            borderWidth: 2,
            left: (section.coordinates.x / 480) * (screenWidth - 60),
            top: section.coordinates.y,
            width: (section.coordinates.width / 480) * (screenWidth - 60),
            height: section.coordinates.height,
          }
        ]}
        activeOpacity={0.8}
      >
        <Text style={styles.sectionName}>{section.name}</Text>
        <Text style={styles.peopleCount}>{section.peopleCount} people</Text>
        
        {/* Individual person dots */}
        {section.peoplePositions?.slice(0, Math.min(section.peopleCount, 20)).map((person: any, index: number) => (
          <View
            key={person.id}
            style={[
              styles.personDot,
              {
                left: (person.x / section.coordinates.width) * ((section.coordinates.width / 480) * (screenWidth - 60)) - 2,
                top: (person.y / section.coordinates.height) * section.coordinates.height - 2,
              }
            ]}
          />
        ))}
        
        {section.peopleCount > 20 && (
          <View style={styles.moreIndicator}>
            <Text style={styles.moreText}>+{section.peopleCount - 20}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#0d9488']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.storeTitle}>Walmart Supercenter</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>LIVE • Store Open</Text>
          </View>
          <Text style={styles.timeText}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color="#059669" />
          <Text style={styles.statNumber}>{totalPeople}</Text>
          <Text style={styles.statLabel}>Total Visitors</Text>
        </View>
        <View style={styles.statCard}>
          <Activity size={24} color="#0284c7" />
          <Text style={styles.statNumber}>{occupancyRate}%</Text>
          <Text style={styles.statLabel}>Occupancy Rate</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#ea580c" />
          <Text style={styles.statNumber}>+12%</Text>
          <Text style={styles.statLabel}>vs Yesterday</Text>
        </View>
      </View>

      <View style={styles.heatMapContainer}>
        <Text style={styles.sectionTitle}>3D Store Heat Map</Text>
        <Text style={styles.heatMapSubtitle}>Real-time crowd density with individual tracking</Text>
        
        <View style={styles.heatMapWrapper}>
          <View style={styles.heatMap}>
            {/* Store layout background */}
            <View style={styles.storeBackground} />
            
            {/* Entrance markers */}
            <View style={[styles.entrance, { left: 20, bottom: 10 }]}>
              <Text style={styles.entranceText}>ENTER</Text>
            </View>
            <View style={[styles.entrance, { right: 20, bottom: 10 }]}>
              <Text style={styles.entranceText}>ENTER</Text>
            </View>
            
            {/* Sections with people dots */}
            {storeSections.map((section) => (
              <HeatMapSection key={section.id} section={section} />
            ))}
          </View>
        </View>
        
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Crowd Density Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Low (0-30%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Medium (30-60%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ea580c' }]} />
              <Text style={styles.legendText}>High (60-85%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.legendText}>Critical (85%+)</Text>
            </View>
          </View>
          <View style={styles.dotLegend}>
            <View style={styles.personDot} />
            <Text style={styles.legendText}>Individual Person</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickStatsContainer}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatNumber}>34</Text>
            <Text style={styles.quickStatLabel}>Available Trolleys</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatNumber}>5</Text>
            <Text style={styles.quickStatLabel}>Active Counters</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatNumber}>21</Text>
            <Text style={styles.quickStatLabel}>Free Seats</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatNumber}>7 min</Text>
            <Text style={styles.quickStatLabel}>Avg Wait Time</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  headerContent: {
    alignItems: 'center',
  },
  storeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e5e7eb',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  heatMapContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  heatMapSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 16,
  },
  heatMapWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  heatMap: {
    height: 320,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  storeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  entrance: {
    position: 'absolute',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  entranceText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  heatMapSection: {
    position: 'absolute',
    borderRadius: 6,
    padding: 6,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionName: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  peopleCount: {
    fontSize: 7,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  personDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  moreIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  moreText: {
    fontSize: 6,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  legendContainer: {
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  dotLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickStatsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickStatCard: {
    width: (screenWidth - 56) / 2,
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
  quickStatNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  quickStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});