// AppText.js
import { Text, StyleSheet } from 'react-native';

// Esse componente recebe todas as propriedades de um texto normal (props)
export default function AppText(props) {
  return (
    <Text 
      {...props} 
      style={[styles.defaultFont, props.style]} // Junta a sua fonte com qualquer outro estilo extra
    >
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'DefaultFont', // O nome que vamos registrar no App.js
    color: 'white',
  }
});