import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Cabecalho from "../components/Header";
import { MissionContext } from "../context/MissaoContext";

export default function Energia() {
  const { dadosSensores, limiares } = useContext(MissionContext);

  //Recebe o nível de energia do contexto
  const nivelEnergia = dadosSensores.energia;

  // Verificação de Alerta
  const emAlerta = nivelEnergia < limiares.energiaMin;
  const corDestaque = emAlerta ? '#FF3333' : '#FF6B35'; 

  // Cálculos para simular novos dados
  const geracaoAtual = nivelEnergia > 20 ? (nivelEnergia * 0.12).toFixed(1) : "0.0"; 
  
  const diasRestantes = Math.max(0, Math.floor((nivelEnergia / 100) * 14)); 
  
  const tempBateria = nivelEnergia < 30 ? 48 : 22; 


  return (
    <View style={styles.container}>
      <Cabecalho titulo={"Sistema de Energia"} exibirBotaoVoltar={true} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        
        {/* Bloco de Status Principal */}
        <View style={styles.blocoPrincipal}>
          <MaterialCommunityIcons 
            name={emAlerta ? "battery-alert" : "battery-charging-100"} 
            size={80} 
            color={corDestaque} 
          />
          <Text style={[styles.valorPrincipal, { color: corDestaque }]}>
            {nivelEnergia}%
          </Text>
          <Text style={styles.textoStatus}>
            {emAlerta ? "ALERTA: CAPACIDADE CRÍTICA" : "OPERAÇÃO NOMINAL"}
          </Text>
        </View>

        <View style={styles.listaDetalhes}>
          
          {/* Card de Geração Atual */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="solar-panel-large" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Geração Solar</Text>
              <Text style={styles.valorCard}>+{geracaoAtual} kW/h</Text>
            </View>
          </View>

          {/* Card de Autonomia */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="clock-outline" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Autonomia Estimada</Text>
              <Text style={styles.valorCard}>
                {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
              </Text>
            </View>
          </View>

          {/* Card de Consumo atual */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="lightning-bolt" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Consumo dos Sistemas</Text>
              <Text style={styles.valorCard}>-8.5 kW/h</Text>
            </View>
          </View>

          {/* Card da temperatura da bateria */}
          <View style={[styles.cardHorizontal, tempBateria > 40 && styles.cardAlertaSecundario]}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons 
                name="thermometer" 
                size={32} 
                color={tempBateria > 40 ? '#FF3333' : '#FF6B35'} 
              />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Temperatura da Bateria</Text>
              <Text style={[styles.valorCard, tempBateria > 40 && { color: '#FF3333' }]}>
                {tempBateria}°C
              </Text>
            </View>
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515', 
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  blocoPrincipal: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 1000,
    alignSelf: 'center',
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  valorPrincipal: {
    fontSize: 54,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textoStatus: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: '600',
  },
  listaDetalhes: {
    marginTop: 10,
  },
  cardHorizontal: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardAlertaSecundario: {
    borderColor: '#950032',
    backgroundColor: '#6c00244d',
  },
  areaIcone: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff682c17',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  areaTexto: {
    flex: 1,
  },
  tituloCard: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 4,
  },
  valorCard: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});