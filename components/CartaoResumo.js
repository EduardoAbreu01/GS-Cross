import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CartaoResumo({ icone, titulo, valor, textoSecundario, emAlerta, onPress }) {
  const corDestaque = emAlerta ? '#FF3333' : '#FF6B35';

  return (
    <TouchableOpacity style={[estilos.cartao, emAlerta && estilos.cartaoAlerta]} onPress={onPress}>
      <View style={estilos.cabecalhoCartao}>
        <Ionicons name={icone} size={24} color={corDestaque} />
        <Text style={estilos.tituloCartao}>{titulo}</Text>
      </View>
      <Text style={[estilos.valorCartao, { color: corDestaque }]}>{valor}</Text>
      <Text style={estilos.textoSecundarioCartao}>{textoSecundario}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    elevation: 2,
  },
  cartaoLarguraTotal: {
    width: '100%',
  },
  cabecalhoCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tituloCartao: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  valorCartao: {
    color: '#FF6B35',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textoSecundarioCartao: {
    color: '#888888',
    fontSize: 12,
  },
});