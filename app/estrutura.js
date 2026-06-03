import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Cabecalho from "../components/Header";
import { MissionContext } from "../context/MissaoContext";

export default function Estrutura() {
  const { dadosSensores, limiares } = useContext(MissionContext);

  // Recebe a integridade da estrutura do contexto
  const nivelEstrutura = dadosSensores.estrutura;

  // Verificação de Alerta
  const emAlerta = nivelEstrutura < limiares.estruturaMin;
  const corDestaque = emAlerta ? '#FF3333' : '#FF6B35';

  // Cálculos para simular novos dados
  const microImpactos = (100 - nivelEstrutura) * 4;

  const radiacao = emAlerta ? (2.4 + ((100 - nivelEstrutura) * 0.8)).toFixed(1) : "2.4";
  const alertaRadiacao = parseFloat(radiacao) > 15.0; 

  let statusVedacao = "Selagem Hermética Nominal";
  if (nivelEstrutura < 50) statusVedacao = "FALHA CRÍTICA DE VEDAÇÃO";
  else if (nivelEstrutura < 80) statusVedacao = "Risco de Despressurização";

  const estresseMecanico = emAlerta ? "Elevado (Correção de Rota Necessária)" : "Estável (Dentro dos limites)";

  return (
    <View style={styles.container}>
      <Cabecalho titulo={"Integridade do Casco"} exibirBotaoVoltar={true} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        
        {/* Status Principal */}
        <View style={styles.blocoPrincipal}>
          <MaterialCommunityIcons 
            name={emAlerta ? "shield-alert-outline" : "shield-check-outline"} 
            size={80} 
            color={corDestaque} 
          />
          <Text style={[styles.valorPrincipal, { color: corDestaque }]}>
            {nivelEstrutura}%
          </Text>
          <Text style={styles.textoStatus}>
            {emAlerta ? "ALERTA: DANOS ESTRUTURAIS" : "CHASSI INTACTO"}
          </Text>
        </View>

        <View style={styles.listaDetalhes}>
          
          {/* Card de impactos */}
          <View style={[styles.cardHorizontal, emAlerta && styles.cardAlertaSecundario]}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons 
                name="meteor" 
                size={32} 
                color={emAlerta ? '#FF3333' : '#FF6B35'} 
              />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Micro-impactos Detectados</Text>
              <Text style={[styles.valorCard, emAlerta && { color: '#FF3333' }]}>
                {microImpactos} ocorrências
              </Text>
            </View>
          </View>

          {/* Card de Radiação */}
          <View style={[styles.cardHorizontal, alertaRadiacao && styles.cardAlertaSecundario]}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons 
                name="radioactive" 
                size={32} 
                color={alertaRadiacao ? '#FF3333' : '#FF6B35'} 
              />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Exposição à Radiação</Text>
              <Text style={[styles.valorCard, alertaRadiacao && { color: '#FF3333' }]}>
                {radiacao} mSv
              </Text>
            </View>
          </View>

          {/* Card de Vedação */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons 
                name={nivelEstrutura < 80 ? "door-open" : "door-closed-lock"} 
                size={32} 
                color={nivelEstrutura < 80 ? '#FF3333' : '#FF6B35'} 
              />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Comportas e Eclusas</Text>
              <Text style={[styles.valorCardTexto, nivelEstrutura < 80 && { color: '#FF3333' }]}>
                {statusVedacao}
              </Text>
            </View>
          </View>

          {/* Card de Estresse Mecânico */}
          <View style={styles.cardHorizontal}>
            <View style={styles.areaIcone}>
              <MaterialCommunityIcons name="pulse" size={32} color="#FF6B35" />
            </View>
            <View style={styles.areaTexto}>
              <Text style={styles.tituloCard}>Estresse Mecânico</Text>
              <Text style={styles.valorCardTexto}>
                {estresseMecanico}
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
  valorCardTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});