import { Image, Text, useWindowDimensions, View } from "react-native"
import { AntDesign, FontAwesome, Feather, Ionicons } from "@expo/vector-icons";

import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, AdvancedVideo } from 'cloudinary-react-native';

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "../lib/cloudinary";
import { ResizeMode, Video } from "expo-av";
import PostContent from "./PostContent";

export default function PostListItem({ post }: any) {

    const avatar = cld.image(post.user.avatar_url || 'default_qxvvyb');
    avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));

    return (
        <View className="bg-white">

            {/* POST */}

            <View className="p-3 flex-row items-center gap-2" >
                <AdvancedImage
                    cldImg={avatar}
                    className="w-10 aspect-square rounded-full"
                />
                <Text className="font-semibold text-lg" >
                    {post.user.username || 'New User'}
                </Text>
            </View>
            
            {/* Content */}
            <PostContent post={post} />
            
            <View className="flex-row  justify-between p-3" >
                <AntDesign name="like2" size={24} />
                <FontAwesome name="comment-o" size={24} />
                <Feather name="send" size={24} />
                <Ionicons name="save-outline" size={24} />
            </View>
        </View>
    );
}