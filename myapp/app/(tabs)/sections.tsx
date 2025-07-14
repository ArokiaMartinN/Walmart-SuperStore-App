import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, TrendingUp, Clock, MapPin } from 'lucide-react-native';
import { storeSections, getCrowdLevel, getCrowdColor } from '@/components/StoreData';

export default function SectionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Sections' },
    { id: 'grocery', name: 'Grocery' },
    { id: 'produce', name: 'Produce' },
    { id: 'frozen', name: 'Frozen' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'pharmacy', name: 'Pharmacy' },
  ];

  const filteredSections = selectedCategory === 'all' 
    ? storeSections 
    : storeSections.filter(section => section.category === selectedCategory);

  const SectionCard = ({ section }: { section: any }) => {
    const crowdLevel = getCrowdLevel(section.peopleCount, section.capacity);
    const color = getCrowdColor(crowdLevel);
    const occupancyPercentage = Math.round((section.peopleCount / section.capacity) * 100);

    return (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionName}>{section.name}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusIndicator, { backgroundColor: color }]} />
              <Text style={[styles.statusText, { color }]}>
                {crowdLevel.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.peopleCountContainer}>
            <Text style={styles.peopleCountNumber}>{section.peopleCount}</Text>
            <Text style={styles.peopleCountLabel}>people</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${occupancyPercentage}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.capacityText}>
            {occupancyPercentage}% of {section.capacity} capacity
          </Text>
        </View>

        <View style={styles.sectionStats}>
          <View style={styles.statItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.statText}>Peak: 2-4 PM</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={16} color="#059669" />
            <Text style={styles.statText}>+5% vs avg</Text>
          </View>
          <View style={styles.statItem}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.statText}>Zone {section.id}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0284c7', '#0369a1']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Section Analytics</Text>
        <Text style={styles.headerSubtitle}>Real-time crowd monitoring</Text>
      </LinearGradient>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.sectionsContainer}>
        <View style={styles.sectionsGrid}>
          {filteredSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
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
    color: '#e0f2fe',
  },
  categoryContainer: {
    paddingVertical: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  categoryButtonActive: {
    backgroundColor: '#0284c7',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  sectionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionsGrid: {
    gap: 16,
    paddingBottom: 30,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  peopleCountContainer: {
    alignItems: 'center',
  },
  peopleCountNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  peopleCountLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  progressContainer: {
    marginBottom: 16,
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
  capacityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  sectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});