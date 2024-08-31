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
import { useEffect, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";
import { supabase } from "../lib/supabase";
import { sendLikeNotification } from "../utils/notifications";

export default function PostListItem({ post }: any) {

    const { user } = useAuth();

    const [isLiked, setIsLiked] = useState(false);
    const [likeRecord, setLikeRecord] = useState(null);

    useEffect(() => {
        if (post.my_likes.length > 0) {
            setLikeRecord(post.my_likes[0]);
            setIsLiked(true);
        }
    }, [post.my_likes]);

    useEffect(() => {
        if (isLiked) {
            saveLike();
        } else {
            deleteLike();
        }
    }, [isLiked]);

    const saveLike = async () => {
        if (likeRecord) {
            return;
        }
        const { data } = await supabase
            .from('likes')
            .insert([{ user_id: user?.id, post_id: post.id }])
            .select();

        // send notification to the owner of that post
        sendLikeNotification(data[0]);

        setLikeRecord(data[0]);
    };

    const deleteLike = async () => {
        if (likeRecord) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('id', likeRecord.id);
            if (!error) {
                setLikeRecord(null);
            }
        }
    };

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
            <View className="px-3 gap-1">
                
                <Text>
                    <Text className="font-semibold">
                        {post.user.username || 'New user'}{' '}
                    </Text>
                    {post.caption}
                </Text>
            </View>
            <PostContent post={post} />

            <View className="flex-row  justify-between p-3" >
                <View >
                <AntDesign
                    onPress={() => setIsLiked(!isLiked)}
                    name={isLiked ? "like1" : "like2"}
                    size={24}
                    color={isLiked ? 'navy' : 'black'}
                />
                 <Text className="font-semibold">
          {post.likes?.[0]?.count || 0} likes
        </Text>
                </View>
                <FontAwesome name="comment-o" size={24} />
                <Feather name="send" size={24} />
                <Ionicons name="save-outline" size={24} />
            </View>
        </View>
    );
}