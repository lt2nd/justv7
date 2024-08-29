import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native"
import posts from "~/assets/data/posts.json"
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";

export default function FeedScreen() {

   const [posts, setPosts] = useState([] as any);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      fetchPosts();
   }, []);

   const fetchPosts = async () => {
      setLoading(true);
      let { data, error } = await supabase
      .from('posts')
      .select('*, user: profiles(*)')
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
         refreshing={loading}
      />
   );
}

