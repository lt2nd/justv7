import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native"
import posts from "~/assets/data/posts.json"
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "../providers/AuthProvider";

export default function FeedScreen() {

   const [posts, setPosts] = useState([] as any);
   const [loading, setLoading] = useState(false);

   const { user } = useAuth();

   useEffect(() => {
      fetchPosts();
   }, []);

   const fetchPosts = async () => {
      setLoading(true);
      let { data, error } = await supabase
      .from('posts')
      .select('*, user:profiles(*), my_likes:likes(*), likes(count)')
      .eq('my_likes.user_id', user?.id)
      .order('created_at', {ascending: false});
      
      if(error) {
         Alert.alert("Something went wrong")
      }
      setPosts(data);
      setLoading(false);
   };
   

   return (
      <FlatList 
         data={posts}
         className=""
         contentContainerStyle={{ gap:1, maxWidth: 512, width: '100%', alignSelf: 'center', }}
         renderItem={( {item} ) => <PostListItem post={item} />}      
         showsVerticalScrollIndicator={false}
         onRefresh={fetchPosts}
         initialNumToRender={20}
         refreshing={loading}
      />
   );
}

