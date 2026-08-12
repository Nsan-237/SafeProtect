import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CategoryCard } from "../../components/shared/CategoryCard";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

const YAOUNDE_COORD = {
  latitude: 3.848,
  longitude: 11.5021,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const ReportIncidentScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("Yaoundé, Mfoundi");
  const [riskLevel, setRiskLevel] = useState("High");
  const [loading, setLoading] = useState(false);
  
  // Map specific state
  const [mapRegion, setMapRegion] = useState<Region>(YAOUNDE_COORD);
  const [markerCoord, setMarkerCoord] = useState(YAOUNDE_COORD);

  // Evidence images state
  const [evidenceImages, setEvidenceImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const categories = [
    { title: "Physical Abuse", icon: "hand-left" },
    { title: "Sexual Abuse", icon: "body" },
    { title: "Emotional Abuse", icon: "sad" },
    { title: "Neglect", icon: "home" },
    { title: "Domestic Violence", icon: "warning" },
    { title: "Other", icon: "ellipsis-horizontal" },
  ];

  const mapCategory = (cat: string) => {
    switch (cat) {
      case "Physical Abuse": return "PHYSICAL_ABUSE";
      case "Sexual Abuse": return "SEXUAL_ABUSE";
      case "Domestic Violence": return "DOMESTIC_VIOLENCE";
      case "Emotional Abuse": return "EMOTIONAL_ABUSE";
      case "Neglect": return "NEGLECT";
      default: return "OTHER";
    }
  };

  const mapRiskLevel = (lvl: string) => {
    switch (lvl) {
      case "Low": return "LOW";
      case "Medium": return "MEDIUM";
      case "High": return "HIGH";
      case "Critical": return "CRITICAL";
      default: return "HIGH";
    }
  };

  // Request location permissions and grab current location
  useEffect(() => {
    if (step === 2) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        try {
          let loc = await Location.getCurrentPositionAsync({});
          const newRegion = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          setMapRegion(newRegion);
          setMarkerCoord(newRegion);
          
          // Try reverse geocoding
          let address = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          });
          
          if (address.length > 0) {
            const add = address[0];
            const locString = [add.street, add.city, add.region].filter(Boolean).join(", ");
            if (locString) setLocation(locString);
          }
        } catch (err) {
          console.warn("Could not fetch location", err);
        }
      })();
    }
  }, [step]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setEvidenceImages(prev => {
        const newImages = [...prev, ...result.assets];
        return newImages.slice(0, 5); // Limit to 5 images
      });
    }
  };

  const takePhoto = async () => {
    // Request camera permissions first
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Sorry, we need camera permissions to make this work!");
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setEvidenceImages(prev => {
        const newImages = [...prev, ...result.assets];
        return newImages.slice(0, 5); // Limit to 5 images
      });
    }
  };

  const removeImage = (uri: string) => {
    setEvidenceImages(prev => prev.filter(img => img.uri !== uri));
  };

  const handleNext = () => {
    if (step === 1 && !category) {
      Alert.alert("Required", "Please select a category of incident to continue.");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Combine manual text location with GPS coords if available
      const finalLocation = `${location} (Lat: ${markerCoord.latitude.toFixed(4)}, Lng: ${markerCoord.longitude.toFixed(4)})`;

      const formData = new FormData();
      if (user?.victimProfile?.id) {
        formData.append('victimId', user.victimProfile.id);
      }
      formData.append('category', mapCategory(category));
      formData.append('description', details || `Reported ${category} incident at ${location}`);
      formData.append('location', finalLocation);
      formData.append('date', new Date().toISOString());
      formData.append('riskLevel', mapRiskLevel(riskLevel));
      formData.append('isAnonymous', 'false');

      if (evidenceImages.length > 0) {
        // According to instructions backend accepts a single file currently `upload.single('evidence')`
        const img = evidenceImages[0];
        formData.append('evidence', {
          uri: img.uri,
          name: img.fileName || 'evidence.jpg',
          type: img.mimeType || 'image/jpeg',
        } as any);
      }

      const res = await api.post("/incidents", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const caseNum = res.data?.case?.caseNumber || "SPC-UNKNOWN";

      Alert.alert(
        "✅ Report Submitted",
        `Incident reported successfully! Case #${caseNum} has been generated and assigned to a social worker.`,
        [
          {
            text: "Return to Home",
            onPress: () => navigation.popToTop(),
          },
        ],
      );
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Failed to submit incident report.";
      Alert.alert("Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 10,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : navigation?.goBack())}
          style={{ padding: 6, marginLeft: -6 }}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#1E1E2D", marginLeft: 12 }}>
          Report an Incident
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Step Progress Label */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
            Step {step} of 4
          </Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                style={{
                  height: 6,
                  flex: 1,
                  borderRadius: 3,
                  backgroundColor: s <= step ? "#5B3FD3" : "#E8E8F0",
                }}
              />
            ))}
          </View>
        </View>

        {/* Step 1: Category Grid */}
        {step === 1 && (
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E1E2D", marginBottom: 4 }}>
              What happened?
            </Text>
            <Text style={{ fontSize: 13, color: "#75759E", marginBottom: 20 }}>
              Please select the type of incident
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {categories.map((c) => (
                <View key={c.title} style={{ width: "48%", marginBottom: 14 }}>
                  <CategoryCard
                    title={c.title}
                    icon={c.icon}
                    selected={category === c.title}
                    onPress={() => setCategory(c.title)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Incident Details */}
        {step === 2 && (
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E1E2D", marginBottom: 4 }}>
              Incident Details & Location
            </Text>
            <Text style={{ fontSize: 13, color: "#75759E", marginBottom: 20 }}>
              Describe what happened and pinpoint the location
            </Text>

            <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 6 }}>
              Description
            </Text>
            <TextInput
              style={{
                backgroundColor: "#FFFFFF",
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: "#E8E8F0",
                fontSize: 15,
                color: "#1E1E2D",
                minHeight: 100,
                marginBottom: 16,
              }}
              placeholder="Provide details about the incident..."
              placeholderTextColor="#B0B0C8"
              multiline
              textAlignVertical="top"
              value={details}
              onChangeText={setDetails}
            />

            <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 6 }}>
              Photo Evidence (Optional)
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1.5,
                  borderColor: "#5B3FD3",
                  borderStyle: "dashed",
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Ionicons name="images-outline" size={20} color="#5B3FD3" />
                <Text style={{ color: "#5B3FD3", fontWeight: "600", fontSize: 14 }}>Attach Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1.5,
                  borderColor: "#5B3FD3",
                  borderStyle: "dashed",
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Ionicons name="camera-outline" size={20} color="#5B3FD3" />
                <Text style={{ color: "#5B3FD3", fontWeight: "600", fontSize: 14 }}>Take Photo</Text>
              </TouchableOpacity>
            </View>

            {evidenceImages.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#75759E", marginBottom: 8 }}>
                  Selected Photos ({evidenceImages.length}/5)
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {evidenceImages.map((img, index) => (
                    <View key={index} style={{ marginRight: 12, position: 'relative' }}>
                      <Image
                        source={{ uri: img.uri }}
                        style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: "#E8E8F0" }}
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(img.uri)}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          backgroundColor: '#FF2E55',
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 2,
                          borderColor: '#FFFFFF',
                        }}
                      >
                        <Ionicons name="close" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 6 }}>
              Location Address
            </Text>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: "#E8E8F0",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 14,
                marginBottom: 16,
              }}
            >
              <Ionicons name="location-outline" size={18} color="#75759E" style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: "#1E1E2D" }}
                placeholder="City, District, Region"
                placeholderTextColor="#B0B0C8"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 6 }}>
              Pinpoint on Map
            </Text>
            <View style={{ height: 200, borderRadius: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: '#E8E8F0' }}>
              <MapView
                style={StyleSheet.absoluteFillObject}
                region={mapRegion}
                onRegionChangeComplete={(r) => setMapRegion(r)}
                onPress={(e) => setMarkerCoord({
                  ...markerCoord,
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude
                })}
              >
                <Marker
                  coordinate={markerCoord}
                  title="Incident Location"
                  draggable
                  onDragEnd={(e) => setMarkerCoord({
                    ...markerCoord,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude
                  })}
                />
              </MapView>
            </View>
            <Text style={{ fontSize: 11, color: "#75759E", marginTop: 6, textAlign: 'center' }}>
              Tap or drag the marker to adjust the exact location.
            </Text>
          </View>
        )}

        {/* Step 3: Risk Level */}
        {step === 3 && (
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E1E2D", marginBottom: 4 }}>
              Risk Level
            </Text>
            <Text style={{ fontSize: 13, color: "#75759E", marginBottom: 20 }}>
              How urgently do you need assistance?
            </Text>

            {["Low", "Medium", "High", "Critical"].map((level) => {
              const isSel = riskLevel === level;
              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setRiskLevel(level)}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: isSel ? "#F0EDFF" : "#FFFFFF",
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: isSel ? "#5B3FD3" : "#E8E8F0",
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "800", color: isSel ? "#5B3FD3" : "#1E1E2D" }}>
                    {level} Urgency
                  </Text>
                  {isSel && <Ionicons name="checkmark-circle" size={22} color="#5B3FD3" />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E1E2D", marginBottom: 4 }}>
              Review & Submit
            </Text>
            <Text style={{ fontSize: 13, color: "#75759E", marginBottom: 20 }}>
              Confirm your report details before submitting
            </Text>

            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#F0F0F5", marginBottom: 20 }}>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 2 }}>Category</Text>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E1E2D" }}>{category}</Text>
              </View>

              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 2 }}>Details</Text>
                <Text style={{ fontSize: 14, color: "#1E1E2D" }}>{details || "No additional details specified."}</Text>
              </View>

              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 2 }}>Evidence</Text>
                <Text style={{ fontSize: 14, color: "#1E1E2D" }}>
                  {evidenceImages.length > 0 
                    ? `${evidenceImages.length} photo(s) attached` 
                    : "No photos attached"}
                </Text>
              </View>

              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 2 }}>Location</Text>
                <Text style={{ fontSize: 14, color: "#1E1E2D" }}>{location}</Text>
                <Text style={{ fontSize: 12, color: "#75759E", marginTop: 2 }}>Lat: {markerCoord.latitude.toFixed(4)}, Lng: {markerCoord.longitude.toFixed(4)}</Text>
              </View>

              <View>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#75759E", textTransform: "uppercase", marginBottom: 4 }}>Risk Level</Text>
                <View style={{ backgroundColor: "#FFF0F3", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" }}>
                  <Text style={{ color: "#FF2E55", fontSize: 12, fontWeight: "800" }}>{riskLevel} Priority</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Next / Submit Button */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            onPress={handleNext}
            disabled={loading}
            activeOpacity={0.85}
            style={{
              backgroundColor: loading ? "#8B6FF7" : "#5B3FD3",
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: "#5B3FD3",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {loading && <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />}
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 16 }}>
              {step === 4 ? (loading ? "Submitting Report..." : "Submit Report") : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
