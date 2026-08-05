import React, { useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const categories = ["All", "Medical", "Legal", "Psychosocial", "Shelter"];

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

const servicesData: ServiceItem[] = [
  {
    id: "1",
    name: "Central Hospital Yaoundé",
    category: "Medical",
    distance: "2.3 km",
    address: "Place Henri Dunant, Yaoundé",
    phone: "+237 222 234 000",
    hours: "24/7 Emergency Care",
    icon: "medical-outline",
    iconBg: "#F0EDFF",
    iconColor: "#5B3FD3",
  },
  {
    id: "2",
    name: "Mfoundi Police Station",
    category: "Law Enforcement",
    distance: "1.8 km",
    address: "Avenue de l'Indépendance, Yaoundé",
    phone: "117",
    hours: "24/7 Open",
    icon: "shield-checkmark-outline",
    iconBg: "#FFF3E0",
    iconColor: "#E65100",
  },
  {
    id: "3",
    name: "National Social Welfare Office",
    category: "Social Services",
    distance: "2.1 km",
    address: "MINAS Building, Yaoundé",
    phone: "+237 222 220 111",
    hours: "Mon - Fri: 8:00 AM - 4:00 PM",
    icon: "people-outline",
    iconBg: "#E3F2FD",
    iconColor: "#1565C0",
  },
  {
    id: "4",
    name: "Women's Legal Aid Center",
    category: "Legal",
    distance: "3.5 km",
    address: "Bastos, Quarter 4, Yaoundé",
    phone: "+237 677 890 123",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM",
    icon: "ribbon-outline",
    iconBg: "#FFF0F3",
    iconColor: "#EC4899",
  },
  {
    id: "5",
    name: "Safe Shelter Yaoundé",
    category: "Shelter",
    distance: "4.2 km",
    address: "Confidential Location, Yaoundé",
    phone: "1332",
    hours: "24/7 Confidential Intake",
    icon: "home-outline",
    iconBg: "#E8F5E9",
    iconColor: "#2E7D32",
  },
];

export const ServicesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );

  const filteredServices = servicesData.filter((s) => {
    // Category match logic
    let matchesCategory = true;
    if (selectedCategory === "Medical")
      matchesCategory = s.category === "Medical";
    else if (selectedCategory === "Legal")
      matchesCategory =
        s.category === "Legal" || s.category === "Law Enforcement";
    else if (selectedCategory === "Psychosocial")
      matchesCategory = s.category === "Social Services";
    else if (selectedCategory === "Shelter")
      matchesCategory = s.category === "Shelter";

    // Search query match logic
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
      >
        {filteredServices.length === 0 ? (
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
