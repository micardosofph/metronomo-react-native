import { View, StyleSheet, Button, Text, ScrollView } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

const audioSource = require('./assets/Hello.mp3');

const metronomeSounds = [
  {
    name: "Click clássico",
    beatHigh: require('./assets/metronomeClicks/flClickHi.wav'),
    beatLow: require('./assets/metronomeClicks/flClickLo.wav')
  },
  {
    name: "Beep",
    beatHigh: require('./assets/metronomeClicks/beepHi.wav'),
    beatLow: require('./assets/metronomeClicks/beepLo.wav')
  },
  {
    name: "Palma",
    beatHigh: require('./assets/metronomeClicks/clapHi.wav'),
    beatLow: require('./assets/metronomeClicks/clapLo.wav')
  },
  {
    name: "Bateria",
    beatHigh: require('./assets/metronomeClicks/snareHi.wav'),
    beatLow: require('./assets/metronomeClicks/snareLo.wav')
  },
  {
    name: "Lata",
    beatHigh: require('./assets/metronomeClicks/canHi.wav'),
    beatLow: require('./assets/metronomeClicks/canLo.wav')
  },
];

function CreateMetronomeBeatsElement({ som }) {
  const playerHigh = useAudioPlayer(som.beatHigh);
  const playerLow = useAudioPlayer(som.beatLow);

  const playSound = (player) => {
    if (player) {
      player.seekTo(0);
      player.play();
    }
  };

  return (
    <View style={styles.soundItem}>
      <Text style={styles.soundName}>{som.name}</Text>
      <View style={styles.buttonGroup}>
        <Button title="Alto" onPress={() => playSound(playerHigh)} />
        <Button title="Baixo" onPress={() => playSound(playerLow)} />
      </View>
    </View>
  );
}

export default function App() {
  const player = useAudioPlayer(audioSource);

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={() => player.play()} />
      <Button
        title="Replay Sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />

      <Text>Teste de metronomo beats</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}>
        {metronomeSounds.map((som) => (
          <CreateMetronomeBeatsElement key={som.name} som={som} />
        ))}
      </ScrollView>

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },

  scrollView: {

  },

  scrollContent: {

  },

  soundItem: {

  },

  soundName: {

  },

  buttonGroup: {

  },
});
