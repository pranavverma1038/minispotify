import { AudioPro, AudioProContentType } from 'react-native-audio-pro';

try {
  AudioPro.configure({ contentType: AudioProContentType.MUSIC }); 
} catch (err) {
  console.error('contentType error in constants:', err);
}

export const trackPlaylistData = [
  {
    id: '1',
    title: 'Maan Meri Jaan',
    artist: 'King',
    album: 'Champagne Talk',
    artwork:
      'https://c.saavncdn.com/734/Champagne-Talk-Hindi-2022-20221008011951-500x500.jpg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Raataan Lambiyan',
    artist: 'Tanishk Bagchi, Asees Kaur',
    album: 'Shershaah',
    artwork:
      'https://c.saavncdn.com/238/Shershaah-Original-Motion-Picture-Soundtrack--Hindi-2021-20210815181610-500x500.jpg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Kesariya',
    artist: 'Arijit Singh, Amitabh Bhattacharya',
    album: 'Brahmastra',
    artwork:
      'https://c.saavncdn.com/191/Kesariya-From-Brahmastra-Hindi-2022-20220717092820-500x500.jpg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    title: 'Title Track',
    artist: 'Arijit Singh, Parampara Tandon',
    album: 'Pal Pal Dil Ke Paas',
    artwork:
      'https://c.saavncdn.com/328/Pal-Pal-Dil-Ke-Paas-Hindi-2019-20200420150444-500x500.jpg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: '5',
    title: 'Besharam Rang',
    artist: 'Vishal & Shekhar, Shilpa Rao',
    album: 'Pathaan',
    artwork:
      'https://c.saavncdn.com/807/Pathaan-Hindi-2022-20221222104158-500x500.jpg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
];

