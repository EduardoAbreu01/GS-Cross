import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Cabecalho({ titulo, exibirBotaoVoltar = true }) {
  const router = useRouter();

  return (
    <View style={estilos.containerCabecalho}>
      
      {exibirBotaoVoltar ? (
        <TouchableOpacity 
          style={estilos.botaoVoltar} 
          onPress={() => router.replace("./(tabs)")}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#FF6B35" />
          <Text style={estilos.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      ) : (
        <View style={estilos.blocoInvisivel} />
      )}

      <Text style={estilos.tituloPagina} numberOfLines={1}>
        {titulo}
      </Text>


      <View style={estilos.blocoInvisivel} />
      
    </View>
  );
}

const estilos = StyleSheet.create({
  containerCabecalho: {
    height: 90,
    backgroundColor: '#1E1E1E', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#2A2A2A', 
    paddingTop: 32, 
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70, 
  },
  textoVoltar: {
    color: '#FF6B35', 
    fontSize: 16,
    marginLeft: 4,
  },
  tituloPagina: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, 
  },
  blocoInvisivel: {
    minWidth: 70, 
  },
});