import {
  AudioPro,
  AudioProEventType,
  AudioProContentType,
  AudioProState,
} from 'react-native-audio-pro';
import { trackPlaylistData } from './src/constants';

let isPlaying = false;
let eventListener = null;
let currentTrackIndex = 0;

export async function setupPlayer() {
  let isSetup = false;
  try {
    await AudioPro.configure({ contentType: AudioProContentType.MUSIC });
    isSetup = true;
  } catch (error) {
    console.error('Error setting up player:', error);
  }
  return isSetup;
}

export async function addTrack() {
  try {
    // Get the first track from constants
    const track = trackPlaylistData[currentTrackIndex];
    console.log('Adding track:', track);
    
    // Stop any current playback
    await AudioPro.stop();
    
    // Add track to the queue with all required properties
    await AudioPro.play(track, {
      autoPlay: false,
      keepAwake: true,
      waitForBuffer: true,
      artwork: track.artwork,
    });
    console.log('Track added successfully');
  } catch (error) {
    console.error('Error adding track:', error);
  }
}

export async function togglePlayPause() {
  try {
    // Get the current state
    const state = await AudioPro.getState();
    console.log('Current state:', state);

    if (state === AudioProState.PLAYING) {
      await AudioPro.pause();
      isPlaying = false;
    } else {
      // If we're not playing, make sure we have a track
      const currentTrack = await AudioPro.getPlayingTrack();
      if (!currentTrack) {
        await addTrack();
      } else {
        // Resume playback with the current track
        const track = trackPlaylistData[currentTrackIndex];
        await AudioPro.play(track, {
          autoPlay: true,
          keepAwake: true,
          waitForBuffer: true,
          artwork: track.artwork,
        });
      }
      isPlaying = true;
    }
  } catch (error) {
    console.error('Error toggling play/pause:', error);
  }
}

export async function nextTrack() {
  try {
    // Move to next track
    currentTrackIndex = (currentTrackIndex + 1) % trackPlaylistData.length;
    const track = trackPlaylistData[currentTrackIndex];
    
    await AudioPro.stop();
    await AudioPro.play(track, {
      autoPlay: true,
      keepAwake: true,
      waitForBuffer: true,
      artwork: track.artwork,
    });
    isPlaying = true;
  } catch (error) {
    console.error('Error playing next track:', error);
  }
}

export async function prevTrack() {
  try {
    // Move to previous track
    currentTrackIndex = (currentTrackIndex - 1 + trackPlaylistData.length) % trackPlaylistData.length;
    const track = trackPlaylistData[currentTrackIndex];
    
    await AudioPro.stop();
    await AudioPro.play(track, {
      autoPlay: true,
      keepAwake: true,
      waitForBuffer: true,
      artwork: track.artwork,
    });
    isPlaying = true;
  } catch (error) {
    console.error('Error playing previous track:', error);
  }
}

export async function playbackService() {
  try {
    if (eventListener) {
      eventListener.remove();
    }

    const subscription = AudioPro.addAmbientListener(event => {
      console.log('Received event:', event.type);
      switch (event.type) {
        case AudioProEventType.REMOTE_PLAY_PAUSE:
          togglePlayPause();
          break;
        case AudioProEventType.REMOTE_SKIP_TO_NEXT:
          nextTrack(); 
          break;
        case AudioProEventType.REMOTE_SKIP_TO_PREVIOUS:
          prevTrack(); 
          break;
        case AudioProEventType.REMOTE_STOP:
          AudioPro.stop();
          isPlaying = false;
          break;
        default:
          break;
      }
    });

    eventListener = subscription;
    return subscription;
  } catch (error) {
    console.error('Error setting up playback service:', error);
    return null;
  }
}

export async function playTrack(track) {
  try {
    // Find the index of the track in the playlist
    currentTrackIndex = trackPlaylistData.findIndex(t => t.id === track.id);
    if (currentTrackIndex === -1) {
      console.error('Track not found in playlist');
      return;
    }
    
    await AudioPro.stop();
    await AudioPro.play(track, {
      autoPlay: true,
      keepAwake: true,
      waitForBuffer: true,
      artwork: track.artwork,
    });
    isPlaying = true;
  } catch (error) {
    console.error('Error playing track:', error);
  }
}

export function cleanup() {
  if (eventListener) {
    try {
      eventListener.remove();
    } catch (error) {
      console.error('Error removing event listener:', error);
    }
    eventListener = null;
  }
  isPlaying = false;
}
