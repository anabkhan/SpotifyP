import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, TouchableOpacity, DeviceEventEmitter, AsyncStorage } from "react-native";
import { Favourites, Song } from '../../types';
import styles from './styles';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Sound } from 'expo-av/build/Audio';
import Slider from '@react-native-community/slider';

const PlayerWidget = () => {

    const [song, setSong] = useState<any|null>(null)

    const playSongEventHandler = (arg: Song) => {
        setSong(arg)
        playCurrentSong(arg);
    }

    // let lastPosition: number = 0;

    const sound = useRef<Sound|null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isSliderMoving, setIsSliderMoving] = useState<boolean>(false);
    const [duration, setDuration] = useState<number|null>(null);
    const [lastPosition, setLastPosition] = useState<number>(0);
    const [position, setPosition] = useState<number|null>(null);
    const isFavourite = useRef<boolean>(false);

    const onPlaybackStatusUpdate = (status: any) => {
        setIsPlaying(status.isPlaying)
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
                {/* <View style={[styles.progress, {width: `${getProgress()}%`}]} /> */}
                <Slider
                        style={{width: '100%', height: 5, zIndex:99}}
                        minimumValue={0}
                        maximumValue={100}
                        value={isSliderMoving ? lastPosition : getProgress()}
                        tapToSeek={true}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
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
                                <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color={"white"} />
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