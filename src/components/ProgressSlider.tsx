import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import { useAudioPro, AudioPro } from 'react-native-audio-pro';

export default function ProgressSlider() {
  const playbackState = useAudioPro();
  const position = playbackState?.position || 0;
  const duration = playbackState?.duration || 0;

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSlidingComplete = async (value: number) => {
    try {
      await AudioPro.seekTo(value);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#535353"
        thumbTintColor="#1DB954"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
}); 