import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAudioPro, AudioPro, AudioProState } from 'react-native-audio-pro';
import { playbackService, setupPlayer, addTrack, togglePlayPause, nextTrack, prevTrack, cleanup } from '../musicPlayerServices';
import { EmitterSubscription } from 'react-native';
import ProgressSlider from './components/ProgressSlider';
import { trackPlaylistData } from './constants';

interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
}

export default function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playbackState = useAudioPro();

  useEffect(() => {
    let listener: EmitterSubscription | null = null;

    async function setup() {
      try {
        const isSetup = await setupPlayer();
        if (isSetup) {
          await addTrack();
          listener = await playbackService();
          setIsPlayerReady(true);
        }
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    }

    setup();

    // Cleanup function
    return () => {
      if (listener) {
        listener.remove();
      }
      cleanup();
    };
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const isPlaying = playbackState?.state === AudioProState.PLAYING;

  const renderTrackItem = ({ item }: { item: Track }) => {
    const isCurrentTrack = playbackState?.playingTrack?.title === item.title;
    
    return (
      <View style={[
        styles.trackItem,
        isCurrentTrack && styles.currentTrackItem
      ]}>
        <Image
          source={{ uri: item.artwork }}
          style={styles.trackArtwork}
          resizeMode="cover"
        />
        <View style={styles.trackInfoContainer}>
          <Text style={[
            styles.trackTitle,
            isCurrentTrack && styles.currentTrackTitle
          ]}>{item.title}</Text>
          <Text style={[
            styles.trackArtist,
            isCurrentTrack && styles.currentTrackArtist
          ]}>{item.artist}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={trackPlaylistData}
        keyExtractor={item => item.id}
        renderItem={renderTrackItem}
        style={styles.list}
      />
      <View style={styles.playerContainer}>
        {playbackState?.playingTrack && (
          <View style={styles.nowPlayingContainer}>
            <Image
              source={{ uri: String(playbackState.playingTrack.artwork) }}
              style={styles.nowPlayingArtwork}
              resizeMode="cover"
            />
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingTitle}>
                {playbackState.playingTrack.title}
              </Text>
              <Text style={styles.nowPlayingArtist}>
                {playbackState.playingTrack.artist}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.controls}>
          <TouchableOpacity onPress={prevTrack} style={styles.button}>
            <Text style={styles.buttonText}>⏮️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
            <Text style={styles.buttonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={nextTrack} style={styles.button}>
            <Text style={styles.buttonText}>⏭️</Text>
          </TouchableOpacity>
        </View>

        <ProgressSlider />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  playerContainer: {
    padding: 20,
    backgroundColor: '#e6f7e6',
    borderTopWidth: 1,
    borderTopColor: 'white',
    borderRadius: 20,
    marginBottom: 0,
  },
  nowPlayingContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  nowPlayingArtwork: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  nowPlayingInfo: {
    alignItems: 'center',
  },
  nowPlayingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DB954',
    textAlign: 'center',
  },
  nowPlayingArtist: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  trackItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  currentTrackItem: {
    backgroundColor: '#e6f7e6',
    borderLeftWidth: 4,
    borderLeftColor: '#1DB954',
  },
  trackArtwork: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  trackInfoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentTrackTitle: {
    color: '#1DB954',
    fontWeight: '700',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  currentTrackArtist: {
    color: '#1DB954',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 24,
  },
});

