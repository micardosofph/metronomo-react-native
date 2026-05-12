import { View, StyleSheet, Button, Text, ScrollView, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAudioPlayer } from 'expo-audio';
import Entypo from '@expo/vector-icons/Entypo';

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

export default function App() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedSound, setSelectedSound] = useState(metronomeSounds[0]);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);

  const playerHigh = useAudioPlayer(selectedSound.beatHigh);
  const playerLow = useAudioPlayer(selectedSound.beatLow);

  const nextBeatTime = useRef(0);
  const beatCount = useRef(0);

  useEffect(() => {
    let timer;

    if (isPlaying) {
      nextBeatTime.current = Date.now();
      beatCount.current = 0;

      timer = setInterval(() => {
        const now = Date.now();

        if (now >= nextBeatTime.current) {
          if (beatCount.current % 4 === 0) {
            playerHigh.seekTo(0);
            playerHigh.play();
          } else {
            playerLow.seekTo(0);
            playerLow.play();
          }

          const msPerBeat = 60000 / bpm;
          nextBeatTime.current += msPerBeat;
          beatCount.current++;
        }

      }, 15);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isPlaying, bpm, playerHigh, playerLow]);

  const renderSoundOption = ({ item }) => {
    const isSelected = item.name === selectedSound.name;

    return (
      <TouchableOpacity
        style={styles.radioButtonContainer}
        onPress={() => {
          setIsPlaying(false); // Pausa o metrônomo por segurança
          setSelectedSound(item); // Troca o som
          setSoundPickerVisible(false); // Fecha o popup
        }}
      >
        {/* A bolinha do Radio Button */}
        <View style={styles.outterCircle}>
          {/* Só renderiza a bolinha de dentro SE estiver selecionado */}
          {isSelected && <View style={styles.innerCircle} />}
        </View>
        <Text style={styles.radioText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text>{bpm} BPM</Text>

      <Button
        title={isPlaying ? "PARAR" : "INICIAR"}
        onPress={() => setIsPlaying(!isPlaying)}
        color={isPlaying ? "red" : "green"}
      ></Button>

      <TouchableOpacity
        onPress={() => setSoundPickerVisible(true)}>
        <Text>Mudar som</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={soundPickerVisible}
        onRequestClose={() => setSoundPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Escolha o som</Text>

            <FlatList
              data={metronomeSounds}
              renderItem={renderSoundOption}
              keyExtractor={(item) => item.name}
            />

            <Button title="Cancelar" onPress={() => setSoundPickerVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>


      <View>
        <Text>Escolha o som</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {metronomeSounds.map((som) => (
            <View key={som.name} style={styles.soundItem}>
              <Text>{som.name}</Text>
              <Button
                title="Selecionar"
                onPress={() => {
                  setIsPlaying(false); // Para antes de trocar
                  setSelectedSound(som);
                }}
              />
              <TouchableOpacity>
                <Text>Selecionar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={metronomeSounds}
        renderItem={({ item, index }) =>
          <TouchableOpacity>
            <View style={styles.outterCircle}></View>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        }
        keyExtractor={item => item.name}
      />

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#121212',
    backgroundColor: '#ffffff',
    padding: 10,
    color: 'white',
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

  radioButtonContainer: {

  },

  outterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  }
});
