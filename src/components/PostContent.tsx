import { AdvancedImage } from "cloudinary-react-native";
import { useWindowDimensions } from "react-native";
import { cld } from "../lib/cloudinary";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import { ResizeMode, Video } from "expo-av";


export default function PostContent({ post }: any )  {

    const { width } = useWindowDimensions();

    if (post.media_type === 'image') {
        const image = cld.image(post.image);

        image.resize(thumbnail().width(width).height(width));

        return <AdvancedImage cldImg={image} className="w-full aspect-[7/6] object-cover" />;
    };

    if (post.media_type === 'video') {

        const video = cld.video(post.image);
        video.resize(scale().width(400));
        return (<Video
            style={{ width: '100%', aspectRatio: 1 }}
            className='aspect-[3/4] w-52 rounded-lg'
            source={{
                uri: video.toURL(),
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
        //shouldPlay
        />)
    }
    if (post.media_type === '') {
        return
    }

}