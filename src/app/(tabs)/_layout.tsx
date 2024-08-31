import { Redirect, Tabs } from "expo-router";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useAuth } from "../providers/AuthProvider";
import NotificationProvider from "../providers/NotificationProvider";


export default function TabsLayout() {

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login/" />;
  }
  return (
    <NotificationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'lightblue',
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: 'Just Feeds',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="new"
          options={{
            headerTitle: 'Create post',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="plus-square-o" size={26} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </NotificationProvider>
  );
}