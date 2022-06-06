import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacityComponent,
} from "react-native";
import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { COLORS, icons, SIZES, GOOGLE_API_KEY } from "../constants";
import { Marker } from "react-native-svg";
import MapViewDirections from "react-native-maps-directions";

// const GOOGLE_MAPS_APIKEY = "...";

const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };

// const GOOGLE_MAPS_APIKEY = "…";

const OrderDelivery = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = React.useState(null);
  const [streetName, setStreetName] = React.useState("");
  const [fromLocation, setFromLocation] = React.useState(null);
  const [toLocation, setToLocation] = React.useState(null);
  const [region, setRegion] = React.useState(null);

  // Calculation distance betwwen from location and to location

  React.useState(() => {
    let { restaurant, currentLocation } = route.params;
    let fromLoc = currentLocation.gps;
    let toLoc = restaurant.location;
    let street = currentLocation.street;
    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };
    setRestaurant(restaurant);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
  }, []);

  function renderMap() {
    return (
      <>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
          >
            {/* One you have two points, you can use polygons to connects that points,, it will draw between your origin and destination */}
            <MapViewDirections
              origin={fromLocation}
              destination={toLocation}
              apikey={GOOGLE_API_KEY}
              strokeWidth={5}
              strokeColor={COLORS.primary}
              optimizeWaypoints={true}
            />

            <MapView.Marker coordinate={toLocation}>
              <View
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.primary,
                  }}
                >
                  <Image
                    source={icons.pin}
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: COLORS.white,
                    }}
                  />
                </View>
              </View>
            </MapView.Marker>
            {/* destination */}
            <MapView.Marker
              coordinate={fromLocation}
              anchor={{
                x: 0.5,
                y: 0.5,
              }}
              flat={true}
              // rotation
            >
              <Image
                source={icons.car}
                style={{
                  height: 40,
                  width: 40,
                }}
              />
            </MapView.Marker>
          </MapView>
        </View>
      </>
    );
  }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {renderMap()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
});

export default OrderDelivery;
