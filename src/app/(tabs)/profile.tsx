import { StyleSheet, Text, View, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import Button from '~/src/components/Button';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { cld, uploadImage } from '~/src/lib/cloudinary';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from 'cloudinary-react-native';
import { router } from 'expo-router';

export default function Profile() {

  const defaultimage = require('../../../assets/images/default.png')

  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
  const [avatar_url, setAvatar_url] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    if (!user) {
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      Alert.alert('Failed to fetch profile');
    }

    setUsername(data.username);
    setBio(data.bio);
    setRemoteImage(data.avatar_url);
    setAvatar_url(data.avatar_url);
  };

  const updateProfile = async () => {
    if (!user) {
      return;
    }

    const updatedProfile = {
      id: user.id,
      username,
      bio,
      avatar_url,
    };

    if (image) {
      const response = await uploadImage(image);
      updatedProfile.avatar_url = response.public_id;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(updatedProfile);

    if (error) {
      Alert.alert('Failed to update profile');
    }
    router.push('/(tabs)/');
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  let remoteCldImage;
  if (remoteImage) {
    remoteCldImage = cld.image(remoteImage);
    remoteCldImage.resize(thumbnail().width(300).height(300));
  }

  return (
    <KeyboardAwareScrollView className='p-3 flex-1' >

      {/* Avatar */}

      {image ?
        (<Image
          source={{ uri: image }}
          className='aspect-square w-52 rounded-full self-center'
        />) : remoteCldImage ? (
          <AdvancedImage
            cldImg={remoteCldImage}
            className="w-52 aspect-square self-center rounded-full bg-slate-300"
          />
        ) : (
          <Image source={defaultimage} className='aspect-square w-52 rounded-full self-center' />
        )
      }
      <Text onPress={pickImage} className='text-blue-500 font-semibold m-5 self-center' >
        Change
      </Text>

      {/* Form */}
      <View className='gap-3' >
        <TextInput
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
          className='border border-black-200 p-3 rounded-md'
        />

        <TextInput
          placeholder='Bio'
          value={bio}
          onChangeText={setBio}
          className='border border-black-200 p-3 rounded-md'
        />
      </View>

      {/* Button */}
      <View className='gap-3 mt-20' >
        <Button title='Update Profile' onPress={updateProfile} />
        <Button title='Sign Out' onPress={() => supabase.auth.signOut()} />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({})