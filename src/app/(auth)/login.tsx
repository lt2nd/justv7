import { View, Text, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, AppState, Alert } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from '~/src/lib/supabase';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

const login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 50 }}>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain", backgroundColor: 'black', borderRadius: 5 }}
          source={require('../../../assets/logo-just.png')}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>
            Login to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"gray"}
              autoCapitalize='none'
              inputMode='email'
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="enter your Email"
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={"gray"}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="enter your Password"
              />
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={{ marginLeft: 10 }}
                onPress={toggleShowPassword}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <Text style={{ fontWeight: "500", color: "#007FFF", }}>
              Forgot Password
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 45 }} />

        <Pressable
          onPress={() => signInWithEmail()}
          style={{
            width: 200,
            backgroundColor: "black",
            padding: 15,
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
              color: "white",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/register")}
          style={{ marginTop: 10 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Don't have an account? {' '}
            <Text style={{ color: 'blue' }}>
              Register
            </Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default login