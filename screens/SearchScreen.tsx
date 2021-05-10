import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Keyboard, FlatList, TouchableOpacity, DeviceEventEmitter, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { SEARCH_URL, GET_STREAMING_URL, GET_SUGGESTION_URL } from '../constants/URLs';
import SongListItem from '../components/SongListItem';
import { Song } from '../types';
import Loader from "../components/Loader";
import { Ionicons } from '@expo/vector-icons'; 

export default function SearchScreen() {

  const [text, onChangeText] = React.useState<string>("");
  const [showLoader, setShowLoader] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<any[]|null>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const showSearchResult = async () => {
    if (text && text.length > 0) {
      setShowLoader(true);
      await axios.get(`${SEARCH_URL}?searchQuery=${text}`)
      .then(function (response) {
        setResults(response.data.content)
        setShowLoader(false);
      })
      .catch(function (error) {
        console.log(error);
        setShowLoader(false);
      })
    }
  }

  const onIemClick = async (song: Song) => {
    setShowLoader(true);
    await axios.get(`${GET_STREAMING_URL}?url=${song.videoId}`)
        .then(function (response) {
        song.url = response.data;
        console.log('emitting event')
        DeviceEventEmitter.emit('play-song',song)
        setShowLoader(false);
        })
        .catch(function (error) {
          console.log(error);
          setShowLoader(false);
        })
  }

  const showSuggestions = async (text: string) => {
    console.log(`${GET_SUGGESTION_URL}?searchQuery=${text}`, text)
    await axios.get(`${GET_SUGGESTION_URL}?searchQuery=${text}`)
        .then(function (response) {
          setResults(null);
          setSuggestions(response.data)
          console.log('suggestions',response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
  }

  return (
      <View style={styles.container}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30, left: 25, top: 10}}>Search</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) => {onChangeText(text); showSuggestions(text)}}
            value={text}
            placeholder="songs, lyrics, artists"
            placeholderTextColor="grey"
            onSubmitEditing={showSearchResult}
          />
          {text?.length> 0 && <TouchableOpacity onPress={() => {onChangeText('');setSuggestions([])}}>
            <Ionicons style={{alignSelf: 'center', marginRight: 3}} name="close" size={24} color="black" />
          </TouchableOpacity>}

        </View>

        {(suggestions?.length > 0 && !results) && <View style={styles.suggestions}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
              data={suggestions}
              contentContainerStyle={{ marginBottom: 100 }}
              renderItem={({item}) => <TouchableOpacity onPress={() => {Keyboard.dismiss(); onChangeText(item); showSearchResult()}}>
                  <View style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: 'grey',
                  width: '100%'}}><Text style={styles.suggestionsTitle}>{item}</Text></View>
              </TouchableOpacity>}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps={'handled'}
          />
          </KeyboardAvoidingView>
          </View>}
        
        {showLoader && <View style={{marginTop: '40%', position:'absolute', justifyContent:'center', alignSelf: 'center'}}>
          <Loader size={10} />
          </View>}

      {results && <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={results} 
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => {onIemClick(item)}} >
              <SongListItem song={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.videoId}
          />}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  inputContainer: {
    // flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    // padding: 5,
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  input: {
    // flex: 1,
    width: '90%',
    height: '100%',
    fontSize: 15
  },
  suggestions: {
    // width:'100%',
    // height: '70%',
    // backgroundColor:'white',
    marginLeft: 20,
    marginRight: 20,
    padding: 5
  },
  suggestionsTitle: {
    fontSize: 25,
    color: 'white',
    paddingTop: 5,
    paddingBottom: 5
  }
});
