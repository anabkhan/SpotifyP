import React from 'react';
import { Text, View, Image, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { Song } from '../../types';
import styles from './styles';

export type SonglListItemProps = {
    song: Song
}

const SongListItem = (props: SonglListItemProps) => {
    const {song} = props;

    const formatDuration = () => {

        const duration = song.duration;

        var milliseconds = parseInt((duration % 1000) / 100);
        let seconds: any = parseInt((duration / 1000) % 60);
        let minutes: any = parseInt((duration / (1000 * 60)) % 60);
        let hours: any = parseInt((duration / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return (hours == '00' ? '' : hours + ":") + minutes + ":" + seconds ;
    }

    if (song.type == 'song' || song.type == 'video') {
        return (
            // <TouchableOpacity onPress={onIemClick} >
                <View style={styles.container}>
                    <Image source={{uri: song.thumbnails[0] ? song.thumbnails[0].url : song.thumbnails.url}} style={styles.image} />
                    <Text style={{alignSelf:'flex-end', right: 10, color:'white', position: 'absolute', fontWeight: 'bold'}}>{formatDuration()}</Text>
                    <View style={styles.rightContainer}>
                        <Text style={styles.title} numberOfLines={1}>{song.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.artist}>{song.artist ? song.artist.name : song.author}</Text>
                        </View>
                    </View>
                </View>
            // </TouchableOpacity>
        )
    } else {
        return(
            <></>
          ); 
    }
        
} 

export default SongListItem;