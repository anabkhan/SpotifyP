import React from "react";

import { DeviceEventEmitter, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Album, Song } from "../../types";
import AlbumComponent from "../Album";
import styles from "./styles";
import axios from 'axios';
import { GET_STREAMING_URL } from '../../constants/URLs';
import Loader from "../Loader";

export type AlbumCategoryProps = {
    title: string;
    albums: Album[] | Song[];
}


const AlbumCategory  = (props: AlbumCategoryProps) => {
    
    const [showLoader, setShowLoader] = React.useState<boolean>(false);


    const onIemClick = async (song: Song) => {
        setShowLoader(true);
        await axios.get(`${GET_STREAMING_URL}?url=${song.videoId}`)
            .then(function (response) {
            song.url = response.data;
            DeviceEventEmitter.emit('play-song',song)
            setShowLoader(false);
            })
            .catch(function (error) {
              console.log(error);
              setShowLoader(false);
            })
      }
    
    return (
     <View style={styles.container}>
         {/* Title of category */}
         <Text style={styles.title}>{props.title}</Text>
         {/* List of Albums */}
         <FlatList
            horizontal={true}
            data={props.albums}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => {onIemClick(item)}} >
                    <AlbumComponent album={item} />
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.videoId}
            />

        {showLoader && <View style={{marginTop: '40%', position:'absolute', justifyContent:'center', alignSelf: 'center'}}>
          <Loader size={10} />
          </View>}
     </View>
)}

export default AlbumCategory;