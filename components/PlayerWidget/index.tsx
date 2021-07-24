import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, TouchableOpacity, DeviceEventEmitter, AsyncStorage, ActivityIndicator } from "react-native";
import { Favourites, Song } from '../../types';
import styles from './styles';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Sound } from 'expo-av/build/Audio';
import Slider from '@react-native-community/slider';
import TrackPlayer from 'react-native-track-player';

const PlayerWidget = () => {

    // const playSong1 = async () => {
    //     await TrackPlayer.setupPlayer();
    //     // Add a track to the queue
    //     await TrackPlayer.add({
    //         id: 'trackId',
    //         url: 'http://dl.navasong.ir/Media/Playlist/Taylor%20Swift/This%20Is%20Taylor%20Swift%20%282018%29/01%20Delicate.mp3',
    //         title: 'Track Title',
    //         artist: 'Track Artist',
    //         artwork: 'https://upload.wikimedia.org/wikipedia/en/5/59/Delicate_by_Taylor_Swift_%28Sawyr_and_Ryan_Tedder_remix%29.png'
    //     });

    //     // Start playing it
    //     await TrackPlayer.play();
    // }


    const [song, setSong] = useState<any|null>(null)

    const playSongEventHandler = (arg: Song) => {
        setSong(arg)
        playCurrentSong(arg);
        // playSong1();
    }

    // let lastPosition: number = 0;

    const sound = useRef<Sound|null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
    const [isSliderMoving, setIsSliderMoving] = useState<boolean>(false);
    const [duration, setDuration] = useState<number|null>(null);
    const [lastPosition, setLastPosition] = useState<number>(0);
    const [position, setPosition] = useState<number|null>(null);
    const isFavourite = useRef<boolean>(false);

    const onPlaybackStatusUpdate = (status: any) => {
        setIsPlaying(status.isPlaying)
        setIsLoading(!status.isPlaying)
        setDuration(status.durationMillis);
        setPosition(status.positionMillis)
    }
    
    const playCurrentSong = async (song: Song) => {

        isFavourite.current = false;

        if (sound?.current) {
            console.log('song already playing, stopping it')
            await sound.current?.unloadAsync();
        }

        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        })
        const {sound: newSound} = await Audio.Sound.createAsync({
            uri: song.url,
        },
        {shouldPlay: true},
        onPlaybackStatusUpdate)

        // setSound(newSound);
        sound.current = newSound;

        let value = await AsyncStorage.getItem('FAVOURITES');
        if (value) {
            const favourites = JSON.parse(value);
            if (favourites[song.videoId]) {
                isFavourite.current = true;
            }
        }

        updateRecentlyPlayed(song);
    }

    useEffect(() => {
        DeviceEventEmitter.removeAllListeners();
        DeviceEventEmitter.addListener('play-song', playSongEventHandler);
        //play the sound
        // playCurrentSong();
    }, [])

    const onPlayPausePress = async () => {
        if (!sound) {
            return;
        }
        if (isPlaying) {
            await sound.current?.pauseAsync();
        } else {
            await sound.current?.playAsync();
        }
        setIsPausedByUser(isPlaying);
    }

    const updateRecentlyPlayed = async (song: Song) => {
        let value = await AsyncStorage.getItem('RECENTLY_PLAYED');
        if (!value) {
            value = JSON.stringify({});
        }
        const recents = JSON.parse(value);
        if (recents[song.videoId]) {
            delete recents[song.videoId]
        }
        let newToRecent: any = {};
        newToRecent[song.videoId] = song;
        const updatedRecents = {
            ...newToRecent,
            ...recents
        }
        const keys = Object.keys(updateRecentlyPlayed)
        if (keys.length > 20) {
            const lastKey = keys[keys.length - 1];
            delete recents[lastKey]
        }
        console.log('updating to recently played',updatedRecents)
        await AsyncStorage.setItem('RECENTLY_PLAYED',JSON.stringify(updatedRecents));
        DeviceEventEmitter.emit('album-category-updated');
    }

    const onFavouritePress = async() => {
        console.log('song being played', song);
        let value = await AsyncStorage.getItem('FAVOURITES');
        if (!value) {
            value = JSON.stringify({});
        }
        const favourites = JSON.parse(value);
        if (favourites[song.videoId]) {
            delete favourites[song.videoId];
            // setIsFavourite(false);
            isFavourite.current = false;
        } else {
            favourites[song.videoId] = song;
            // setIsFavourite(true);
            isFavourite.current = true;
        }
        await AsyncStorage.setItem('FAVOURITES',JSON.stringify(favourites));
        DeviceEventEmitter.emit('album-category-updated');
    }

    const onSlidingComplete = async (value: number) => {
        if (sound != null && duration != null && position != null) {
            await sound.current?.setPositionAsync((value * duration) / 100)
        }
        setIsSliderMoving(false);
    }

    const getProgress = () => {
        if (sound == null || duration == null || position == null) {
            return 0;
        }
        return (position / duration) * 100;
    }
    
    if (song) {
        return (
            <View style={styles.container}>
                <Slider
                        style={{width: '100%', height: 5, zIndex:99}}
                        minimumValue={0}
                        maximumValue={50}
                        value={isSliderMoving ? lastPosition : getProgress()}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="grey"
                        onSlidingStart={(value: number) => {setIsSliderMoving(true);setLastPosition(value)}}
                        onSlidingComplete={onSlidingComplete}
                    />
    
                <View style={styles.row}>
                    <Image source={{uri: song.thumbnails[0] ? song.thumbnails[0].url : song.thumbnails.url}} style={styles.image} />
                    <View style={styles.rightContainer}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.title} numberOfLines={2}>{song.name }</Text>
                            <Text style={styles.artist}>{song.artist ? song.artist.name : song.author}</Text>
                        </View>
    
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={onFavouritePress} >
                                <AntDesign name={isFavourite.current ? "heart" : "hearto"} size={30} color={"white"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onPlayPausePress} >
                                {(!isLoading || isPausedByUser) && <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color={"white"} />}
                                {isLoading && !isPausedByUser && <ActivityIndicator />}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        ) 
    } else {
        return(
            <></>
          ); 
    }

} 

export default PlayerWidget;