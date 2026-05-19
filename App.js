import { View, StyleSheet, Button, Text, ScrollView, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAudioPlayer } from 'expo-audio';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';

import AppText from './AppText';

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
  // pra carregar as fontes
  const [fontsLoaded] = useFonts({
    'DefaultFont': require('./assets/fonts/Inter_18pt-Regular.ttf'),
    'SemiBoldFont': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
    'BoldFont': require('./assets/fonts/Inter_18pt-Bold.ttf'),
    'LightFont': require('./assets/fonts/Inter_18pt-Light.ttf'),
    'ExtraLightFont': require('./assets/fonts/Inter_18pt-ExtraLight.ttf'),
  });

  //return null la na frente linha 93

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

  if (!fontsLoaded) { //aplicativo fica numa tela preta ate carregar (depois colocar loading)
    return null;
  }

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
        <AppText style={styles.radioText}>{item.name}</AppText>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <AppText>{bpm} BPM</AppText>

      <Button
        title={isPlaying ? "PARAR" : "INICIAR"}
        onPress={() => setIsPlaying(!isPlaying)}
        color={isPlaying ? "#22D3EE" : "#8B5CF6"}
      ></Button>

      {/* <TouchableOpacity
      onPress={() => setIsPlaying(!isPlaying)}
      backgroundColor={isPlaying ? "#22D3EE" : "#8B5CF6"}
      style={backgroundColor=z{isPlaying ? "#22D3EE" : "#8B5CF6"}}>
        <AppText>{isPlaying ? "PARAR" : "INICIAR"}</AppText>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => setSoundPickerVisible(true)}
        style={styles.configContainer}>
        <FontAwesome name="gear" size={32} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={soundPickerVisible}
        onRequestClose={() => setSoundPickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay}
          onPress={() => setSoundPickerVisible(false)}>
          <Pressable style={styles.modalContent}>

            <AppText style={styles.modalTitle}>Escolha o som</AppText>

            <FlatList
              data={metronomeSounds}
              renderItem={renderSoundOption}
              keyExtractor={(item) => item.name}
              style={styles.metronomeSoundsList}
            />

            <TouchableOpacity
              onPress={() => setSoundPickerVisible(false)}
              style={styles.cancelButton}>
              <AppText>Cancelar</AppText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    // backgroundColor: '#ffffff',
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

  modalTitle: {
    fontSize: 24
  },

  modalOverlay: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00000050',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'default'
  },

  modalContent: {
    backgroundColor: '#5f5f5f',
    borderRadius: 12,
    padding: 12,
    width: '80%',
    gap: 12,
  },

  metronomeSoundsList: {
    gap: 100,
  },

  radioText: {
    fontSize: 18,
    marginBottom: 8
  },

  configContainer: {
    position: 'absolute',
    top: '6.5%',
    right: '10%',
  },

  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 12
  },

  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  outterCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 100,
    backgroundColor: '#8B5CF6',
  }
});
