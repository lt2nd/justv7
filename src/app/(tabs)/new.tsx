import { Image, StyleSheet, Text, TextInput, View, Pressable, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import Button from '~/src/components/Button';
import { upload } from 'cloudinary-react-native';
import { cld, uploadImage } from '~/src/lib/cloudinary';
import { UploadApiResponse } from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ResizeMode, Video } from 'expo-av';


export default function CreatePost() {

  const emptyimage = cld.image('emptyimage_m9buow');

  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | undefined>();

  const { session } = useAuth();

  // useEffect(() => {
  //   if (!media) {
  //     pickMedia();
  //   }
  // }, [media]);


  const pickMedia = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].type);
    }
  };


  const createPost = async () => {
    if (!media) {
      return;
    }
    const response = await uploadImage(media);
    console.log('image id: ', response?.public_id);


    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          caption,
          image: response?.public_id,
          user_id: session?.user.id,
          media_type: mediaType,
        },
      ])
      .select()

    router.push('/(tabs)/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 70}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
          //flex: 1,
          alignItems: 'center',
          padding: 3,
        }}>
        {/* image */}

        {!media ? (
          <Image 
          source={{uri: 'https://res.cloudinary.com/dvu8rnsgl/image/upload/v1725383193/samples/emptyimage_m9buow.png'}} 
          className='aspect-[3/4] h-70 w-52 rounded-lg' 
          />
        ) : mediaType === 'image' ?
          (<Image
            source={{ uri: media }}
            className="w-64 aspect-[7/10] rounded-lg bg-slate-300"
          />) :  (
            <Video
              style={{ width: '100%', aspectRatio: 1 }}
              className='aspect-[3/4] w-52 rounded-lg'
              source={{
                uri: media,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay
            />
          ) 
        }
        <Text onPress={pickMedia} className='text-blue-500 font-semibold m-5' >
          Change
        </Text>

        {/* text caption */}

        <TextInput
          placeholder='JUST say something...' className='w-full p-3 border-2 border-slate-500 mb-10'
          multiline
          numberOfLines={3}
          maxLength={1000}
          value={caption}
          onChangeText={(newValue) => setCaption(newValue)}
        />

        {/* button */}

        <View className='w-full'>
          <Button title="JUST share" onPress={createPost} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({})