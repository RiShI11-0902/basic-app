
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="todo"
        options={{
          title: "To Do",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code-working-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code-working-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
