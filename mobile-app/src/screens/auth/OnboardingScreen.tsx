import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'SafeProtect Cameroon',
    description: 'A safe space to report incidents, get help, and find resources.\nYou are not alone.',
    image: require('../../../assets/onboarding.png'), // using existing image
  },
  {
    id: '2',
    title: 'Report Anonymously',
    description: 'Your privacy is our priority. Report incidents securely and track your case in real time without fear.',
    image: require('../../../assets/onboarding.png'), // Fallback to same image for prototype
  },
  {
    id: '3',
    title: 'Get Immediate Help',
    description: 'Connect directly with social workers, counselors, and law enforcement when you need them most.',
    image: require('../../../assets/onboarding.png'), // Fallback to same image for prototype
  }
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login');
    }
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={{ width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <View style={{
        width: width * 0.75,
        height: width * 0.75,
        borderRadius: (width * 0.75) / 2,
        backgroundColor: 'rgba(91,63,211,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(139,111,247,0.3)',
        marginBottom: 40,
      }}>
        <Image
          source={item.image}
          style={{ width: width * 0.68, height: width * 0.68, borderRadius: (width * 0.68) / 2 }}
          resizeMode="cover"
        />
      </View>
      <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 }}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1248' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1248" />

      <View style={{ flex: 3 }}>
        <Animated.FlatList
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: 24, justifyContent: 'space-between' }}>
        {/* Paginator */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', height: 24, alignItems: 'center' }}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i.toString()}
                style={{
                  height: 8,
                  width: dotWidth,
                  borderRadius: 4,
                  backgroundColor: '#FFFFFF',
                  marginHorizontal: 4,
                  opacity,
                }}
              />
            );
          })}
        </View>

        {/* Buttons */}
        <View style={{ width: '100%', paddingBottom: 12 }}>
          {currentIndex === SLIDES.length - 1 ? (
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#5B3FD3',
                paddingVertical: 16,
                borderRadius: 14,
                marginBottom: 14,
                alignItems: 'center',
                shadowColor: '#5B3FD3',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 17 }}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                paddingVertical: 16,
                borderRadius: 14,
                marginBottom: 14,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={scrollToNext}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#1E1248', fontWeight: '800', fontSize: 17 }}>Next</Text>
            </TouchableOpacity>
          )}

          {currentIndex === 0 && (
             <TouchableOpacity
             style={{
               width: '100%',
               borderWidth: 1.5,
               borderColor: 'rgba(255,255,255,0.35)',
               paddingVertical: 16,
               borderRadius: 14,
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: 'center',
               backgroundColor: 'rgba(255,255,255,0.06)',
             }}
             onPress={() => navigation.navigate('EmergencySOS')}
             activeOpacity={0.85}
           >
             <Ionicons name="call" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
             <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>I Need Help Now</Text>
           </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
