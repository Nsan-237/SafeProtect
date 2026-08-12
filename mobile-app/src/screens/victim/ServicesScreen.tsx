import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Organization {
  id: string;
  name: string;
  type: string;
  location: string;
  phone: string;
  email: string;
  description: string;
}

interface ServiceAPIItem {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  description: string;
  isActive: boolean;
  organization: Organization;
}

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  distance: string;
  address: string;
  phone: string;
  hours: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const mapCategoryToIcon = (category: string) => {
  const lowerCat = (category || "").toLowerCase();
  if (lowerCat.includes("medical") || lowerCat.includes("health")) {
    return { icon: "medical-outline" as any, iconBg: "#F0EDFF", iconColor: "#5B3FD3" };
  } else if (lowerCat.includes("legal") || lowerCat.includes("law")) {
    if (lowerCat.includes("law enforcement") || lowerCat.includes("police")) {
      return { icon: "shield-checkmark-outline" as any, iconBg: "#FFF3E0", iconColor: "#E65100" };
    }
    return { icon: "ribbon-outline" as any, iconBg: "#FFF0F3", iconColor: "#EC4899" };
  } else if (lowerCat.includes("social") || lowerCat.includes("psychosocial")) {
    return { icon: "people-outline" as any, iconBg: "#E3F2FD", iconColor: "#1565C0" };
  } else if (lowerCat.includes("shelter") || lowerCat.includes("home")) {
    return { icon: "home-outline" as any, iconBg: "#E8F5E9", iconColor: "#2E7D32" };
  }
  return { icon: "business-outline" as any, iconBg: "#F5F5F5", iconColor: "#757575" };
};

export const ServicesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth(); // If auth context is needed
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  const [servicesData, setServicesData] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/services');
      const apiData: ServiceAPIItem[] = response.data;
      
      const uniqueCategories = new Set<string>();
      
      const mappedData: ServiceItem[] = apiData.map(item => {
        if (item.category) uniqueCategories.add(item.category);
        const iconConfig = mapCategoryToIcon(item.category);
        
        return {
          id: item.id,
          name: item.name,
          category: item.category || "General",
          distance: "N/A",
          address: item.organization?.location || "Unknown Location",
          phone: item.organization?.phone || "N/A",
          hours: item.description || "N/A",
          icon: iconConfig.icon,
          iconBg: iconConfig.iconBg,
          iconColor: iconConfig.iconColor,
        };
      });
      
      setCategories(["All", ...Array.from(uniqueCategories)]);
      setServicesData(mappedData);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, [fetchServices]);

  const filteredServices = servicesData.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Header Bar */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 14,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{ padding: 6, marginLeft: -6 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#1E1E2D",
              marginLeft: 12,
            }}
          >
            Support Services
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F8F9FE",
            borderRadius: 12,
            paddingHorizontal: 14,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: "#E8E8F0",
          }}
        >
          <Ionicons name="search-outline" size={18} color="#75759E" />
          <TextInput
            placeholder="Search services, locations..."
            placeholderTextColor="#B0B0C8"
            style={{
              flex: 1,
              paddingVertical: 12,
              marginLeft: 10,
              fontSize: 14,
              color: "#1E1E2D",
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#75759E" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Horizontal Category Filters */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  backgroundColor: isActive ? "#5B3FD3" : "#F0F0F5",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: isActive ? "#FFFFFF" : "#75759E",
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Service List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5B3FD3" />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#5B3FD3" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text
              style={{
                color: "#1E1E2D",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 12,
              }}
            >
              Error Loading Services
            </Text>
            <Text
              style={{
                color: "#75759E",
                fontSize: 13,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
            <TouchableOpacity 
              onPress={fetchServices}
              style={{ marginTop: 16, backgroundColor: '#5B3FD3', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredServices.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="search-outline" size={48} color="#B0B0C8" />
            <Text
              style={{
                color: "#1E1E2D",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 12,
              }}
            >
              No Services Found
            </Text>
            <Text
              style={{
                color: "#75759E",
                fontSize: 13,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              Try adjusting your search query or category filter.
            </Text>
          </View>
        ) : (
          filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => setSelectedService(service)}
              activeOpacity={0.8}
              style={{
                backgroundColor: "#FFFFFF",
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#F0F0F5",
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  marginRight: 12,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: service.iconBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={service.icon}
                    size={22}
                    color={service.iconColor}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "800",
                      color: "#1E1E2D",
                      marginBottom: 2,
                    }}
                  >
                    {service.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#75759E",
                      fontWeight: "500",
                    }}
                  >
                    {service.category}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#75759E",
                    marginRight: 6,
                  }}
                >
                  {service.distance}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#B0B0C8" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Service Detail Modal */}
      {selectedService && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedService}
          onRequestClose={() => setSelectedService(null)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
            activeOpacity={1}
            onPress={() => setSelectedService(null)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
                paddingBottom: 36,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#E8E8F0",
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: selectedService.iconBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={selectedService.icon}
                    size={24}
                    color={selectedService.iconColor}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#1E1E2D",
                    }}
                  >
                    {selectedService.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#75759E",
                      fontWeight: "600",
                    }}
                  >
                    {selectedService.category} • {selectedService.distance}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "#F8F9FE",
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="#5B3FD3"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#1E1E2D",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    {selectedService.address}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#5B3FD3"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#1E1E2D",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    {selectedService.hours}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color="#5B3FD3"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#1E1E2D",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    {selectedService.phone}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${selectedService.phone}`);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#5B3FD3",
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Ionicons
                    name="call"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "800",
                      fontSize: 14,
                    }}
                  >
                    Call Center
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedService(null)}
                  style={{
                    flex: 1,
                    backgroundColor: "#F0F0F5",
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#1E1E2D",
                      fontWeight: "700",
                      fontSize: 14,
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};
