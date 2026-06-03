import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Cabecalho from "../components/Header";
import { MissionContext } from "../context/MissaoContext";

export default function Sinal() {
  const { dadosSensores, limiares } = useContext(MissionContext);

  //Recebe a latência real do Contexto
  const latencia = dadosSensores.sinal;

  // Verificação de Alerta
  const emAlerta = latencia > limiares.sinalMax;
  const corDestaque = emAlerta ? '#FF3333' : '#FF6B35'; 

  // Cálculos para simular novos dados
  const qualidadeLink = Math.max(0, 100 - (latencia > 80 ? (latencia - 80) * 0.5 : 0)).toFixed(1);

  const perdaPacotes = latencia > 100 ? ((latencia - 100) * 0.15).toFixed(2) : "0.00";

  let banda = "125.0";
  if (latencia > 150) banda = "2.5"; 
  else if (latencia > 100) banda = "45.0"; 

  const statusAntena = emAlerta ? "Buscando satélite relé..." : "Rastreamento ativo (Lock-on)";

  return (
    <View style={styles.container}>
      <Cabecalho titulo={"Comunicação Orbital"} exibirBotaoVoltar={true} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        
        {/*Status Principal */}
        <View style={styles.blocoPrincipal}>
          <MaterialCommunityIcons 
            name={emAlerta ? "wifi-strength-alert-outline" : "satellite-uplink"} 
            size={80} 
            color={corDestaque} 
          />
          <Text style={[styles.valorPrincipal, { color: corDestaque }]}>
            {latencia}<Text style={styles.unidadeMedida}>ms</Text>
          </Text>
          <Text style={styles.textoStatus}>
            {emAlerta ? "ALERTA: DEGRADAÇÃO DE SINAL" : "LINK ESTÁVEL"}
          </Text>
        </View>

        <View style={styles.listaDetalhes}>
          
          {/* Card de Qualidade do Link */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="connection" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Qualidade do Link (QoS)</Text>
              <Text style={styles.valorCard}>{qualidadeLink}%</Text>
            </View>
          </View>

          {/* Card de Perda de Pacotes */}
          <View style={[styles.cardHorizontal, perdaPacotes > 0 && styles.cardAlertaSecundario]}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons 
                name="package-down" 
                size={32} 
                color={perdaPacotes > 0 ? '#FF3333' : '#FF6B35'} 
              />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Perda de Pacotes</Text>
              <Text style={[styles.valorCard, perdaPacotes > 0 && { color: '#FF3333' }]}>
                {perdaPacotes}%
              </Text>
            </View>
          </View>

          {/* Card de Velocidade da conexão */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="swap-vertical" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Banda Larga Disponível</Text>
              <Text style={styles.valorCard}>{banda} Mbps</Text>
            </View>
          </View>

          {/* Card de Status da Antena */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="radar" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Antena de Alto Ganho</Text>
              <Text style={styles.valorCardTexto}>{statusAntena}</Text>
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
  unidadeMedida: {
    fontSize: 24,
    fontWeight: 'normal',
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
  valorCardTexto: {
    color: '#FFFFFF',
    fontSize: 16, 
    fontWeight: '600',
  }
});