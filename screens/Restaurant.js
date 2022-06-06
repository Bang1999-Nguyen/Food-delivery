import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import React from "react";
import { isIphoneX } from "react-native-iphone-x-helper";
import { icons, COLORS, SIZES, FONTS } from "../constants";

const Restaurant = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const scrollX = new Animated.Value(0);
  const [orderItems, setOrderItems] = React.useState([]);
  function editOrder(action, menuId, price) {
    let orderList = orderItems.slice();
    let item = orderList.filter((item) => item.menuId === menuId);
    if (action === "plus") {
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
    } else {
      if (item.length > 0) {
        if (item[0].qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = item[0].qty * price;
        }
      }
    }
    setOrderItems(orderList);
  }

  function getOrderQty(menuId) {
    let orderItem = orderItems.filter((a) => a.menuId === menuId);
    if (orderItem.length > 0) {
      return orderItem[0].qty;
    }
    return 0;
  }

  function sumOrder() {
    let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);
    return total.toFixed(2);
  }

  function getBasketItemCount() {
    let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);

    return itemCount;
  }

  React.useEffect(() => {
    let { item, currentLocation } = route.params;
    setRestaurant(item);
    setCurrentLocation(currentLocation);
  }, []);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingBottom: SIZES.padding * 2,
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={icons.back}
            resizeMethod="contain"
            style={{
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        {/* Restaurant name section */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: SIZES.padding * 3,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>{restaurant?.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: "center",
          }}
        >
          <Image
            source={icons.list}
            resizeMethod="contain"
            style={{
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderFoodInfo() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment={"center"}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        {restaurant?.menu.map((item, index) => {
          return (
            <View
              key={`menu-${index}`}
              style={{
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: SIZES.height * 0.35,
                }}
              >
                <Image
                  source={item.photo}
                  resizeMethod="cover"
                  style={{
                    width: SIZES.width,
                    height: "100%",
                  }}
                />
                {/* Quantity */}
                <View
                  style={{
                    position: "absolute",
                    bottom: -20,
                    width: SIZES.width,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: 25,
                      borderBottomLeftRadius: 25,
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                    onPress={() => editOrder("minus", item.menuId, item.price)}
                  >
                    <Text style={{ ...FONTS.body2 }}>-</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    <Text style={{ ...FONTS.body2 }}>
                      {getOrderQty(item.menuId)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopRightRadius: 25,
                      borderBottomRightRadius: 25,
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                    onPress={() => editOrder("plus", item.menuId, item.price)}
                  >
                    <Text style={{ ...FONTS.body2 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Name & description */}
              <View
                style={{
                  width: SIZES.width,
                  alignItems: "center",
                  marginTop: 15,
                  paddingBottom: SIZES.padding * 2,
                }}
              >
                <Text
                  style={{
                    marginVertical: 15,
                    textAlign: "center",
                    ...FONTS.h4,
                    fontWeight: "bold",
                  }}
                >
                  {item.name} - {item.price.toFixed(2)}
                </Text>
                <Text
                  style={{
                    textAlign: "center",

                    fontSize: "14px",
                  }}
                >
                  {item.description}
                </Text>
              </View>
              {/* Calories */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                }}
              >
                <Image
                  source={icons.fire}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.body3,
                    color: COLORS.darkgray,
                  }}
                >
                  {item.calories.toFixed(2)} cal
                </Text>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    );
  }
  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View
        style={{
          height: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: "clamp",
            });

            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };
  function renderOrder() {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontWeight: "bold", ...FONTS.h4 }}>
              {`${getBasketItemCount()} items in Cart`}
            </Text>
            <Text
              style={{
                ...FONTS.h4,
                fontWeight: "bold",
              }}
            >
              ${sumOrder()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                source={icons.pin}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.padding,
                  ...FONTS.h5,
                  fontWeight: "bold",
                }}
              >
                Location
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                source={icons.master_card}
                resizeMethod="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.padding,
                  ...FONTS.h4,
                }}
              >
                8888
              </Text>
            </View>
          </View>

          {/* order button */}
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: SIZES.width * 0.9,
                padding: SIZES.padding,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                borderRadius: SIZES.radius,
              }}
              onPress={() =>
                navigation.navigate("OrderDelivery", {
                  restaurant: restaurant,
                  currentLocation: currentLocation,
                })
              }
            >
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                  fontWeight: "bold",
                }}
              >
                Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isIphoneX() && (
          <View
            style={{
              position: "absolute",
              bottom: -34,
              left: 0,
              right: 0,
              height: 34,
              backgroundColor: COLORS.white,
            }}
          ></View>
        )}
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
});

export default Restaurant;
