import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Alerta({ alertas }) {

  if (!alertas || alertas.length === 0) return null;

  return (
    <View style={estilos.secaoAlertas}>
      <Text style={estilos.tituloSecao}>Alertas Ativos ({alertas.length})</Text>
      
      {alertas.map((alerta) => (
        <View 
          key={alerta.id} 
          style={[
            estilos.caixaAlerta, 
            alerta.tipo === 'critico' && estilos.caixaCritica
          ]}
        >
          <Ionicons 
            name="warning" 
            size={20} 
            color={alerta.tipo === 'critico' ? '#FF3333' : '#FFC107'} 
          />
          <Text style={estilos.textoAlerta}>{alerta.mensagem}</Text>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  secaoAlertas: {
    marginBottom: 20,
  },
  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  caixaAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffc1071a',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    marginBottom: 10, 
  },
  caixaCritica: {
    backgroundColor: '#ff33331a',
    borderLeftColor: '#FF3333',
  },
  textoAlerta: {
    color: '#E0E0E0',
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
  },
});