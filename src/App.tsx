import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAudioPro, AudioPro, AudioProState } from 'react-native-audio-pro';
import { playbackService, setupPlayer, addTrack, togglePlayPause, nextTrack, prevTrack, cleanup } from '../musicPlayerServices';
import { EmitterSubscription } from 'react-native';

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

  return (
    <SafeAreaView style={styles.container}>
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

      <Text style={styles.trackInfo}>
        {playbackState?.playingTrack?.title || 'No track playing'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
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
  trackInfo: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  }
});

