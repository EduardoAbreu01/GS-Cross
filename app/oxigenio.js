import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Cabecalho from "../components/Header";
import { MissionContext } from "../context/MissaoContext";

export default function Oxigenio() {
    const { dadosSensores, limiares } = useContext(MissionContext);

    //Recebe o nível de O² do Contexto
    const nivelO2 = dadosSensores.o2;

    // Verificação de Alerta
    const emAlerta = nivelO2 < limiares.o2Min;
    const corDestaque = emAlerta ? '#FF3333' : '#FF6B35';

    // Cálculos para simular novos dados
    const pressaoCabine = emAlerta ? (nivelO2 * 0.4).toFixed(1) : "14.7";

    const nivelCO2 = emAlerta ? (5.0 - (nivelO2 * 0.1)).toFixed(1) : "0.4";

    const alertaCO2 = parseFloat(nivelCO2) > 2.0;

    const horasRestantes = Math.max(0, Math.floor(nivelO2 * 1.5));

    const statusFiltros = alertaCO2 ? "SOBRECARGA / FALHA" : "Filtragem Nominal";

    return (
        <View style={styles.container}>
            <Cabecalho titulo={"Suporte à Vida"} exibirBotaoVoltar={true} />

            <ScrollView contentContainerStyle={styles.conteudo}>

                {/*Status Principal */}
                <View style={styles.blocoPrincipal}>
                    <MaterialCommunityIcons
                        name={emAlerta ? "gas-cylinder" : "molecule"}
                        size={80}
                        color={corDestaque}
                    />
                    <Text style={[styles.valorPrincipal, { color: corDestaque }]}>
                        {nivelO2}%
                    </Text>
                    <Text style={styles.textoStatus}>
                        {emAlerta ? "ALERTA: RISCO BIOLÓGICO" : "ATMOSFERA ESTÁVEL"}
                    </Text>
                </View>

                <View style={styles.listaDetalhes}>

                    {/* Card de Pressão da Cabine */}
                    <View style={[styles.cardHorizontal, emAlerta && styles.cardAlertaSecundario]}>
                        <View style={styles.areaIcone}>
                            <MaterialCommunityIcons
                                name="gauge"
                                size={32}
                                color={emAlerta ? '#FF3333' : '#FF6B35'}
                            />
                        </View>
                        <View style={styles.areaTexto}>
                            <Text style={styles.tituloCard}>Pressão Interna</Text>
                            <Text style={[styles.valorCard, emAlerta && { color: '#FF3333' }]}>
                                {pressaoCabine} PSI
                            </Text>
                        </View>
                    </View>

                    {/* Card de Nível de CO2 */}
                    <View style={[styles.cardHorizontal, alertaCO2 && styles.cardAlertaSecundario]}>
                        <View style={styles.areaIcone}>
                            <MaterialCommunityIcons
                                name="molecule-co2"
                                size={32}
                                color={alertaCO2 ? '#FF3333' : '#FF6B35'}
                            />
                        </View>
                        <View style={styles.areaTexto}>
                            <Text style={styles.tituloCard}>Saturação de Dióxido de Carbono</Text>
                            <Text style={[styles.valorCard, alertaCO2 && { color: '#FF3333' }]}>
                                {nivelCO2}%
                            </Text>
                        </View>
                    </View>

                    {/* Card de Autonomia */}
                    <View style={styles.cardHorizontal}>
                        <View style={styles.areaIcone}>
                            <MaterialCommunityIcons name="timer-outline" size={32} color="#FF6B35" />
                        </View>
                        <View style={styles.areaTexto}>
                            <Text style={styles.tituloCard}>Reserva de Emergência</Text>
                            <Text style={styles.valorCard}>~{horasRestantes} horas</Text>
                        </View>
                    </View>

                    {/* Card de Filtros Purificadores */}
                    <View style={styles.cardHorizontal}>
                        <View style={styles.areaIcone}>
                            <MaterialCommunityIcons name="air-purifier" size={32} color="#FF6B35" />
                        </View>
                        <View style={styles.areaTexto}>
                            <Text style={styles.tituloCard}>Purificadores de Ar (Scrubbers)</Text>
                            <Text style={[styles.valorCardTexto, alertaCO2 && { color: '#FF3333' }]}>
                                {statusFiltros}
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
    backgroundColor: '#151515'
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40
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
    marginTop: 10
  },
  textoStatus: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: '600'
  },
  listaDetalhes: {
    marginTop: 10
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
    flex: 1
  },
  tituloCard: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 4
  },
  valorCard: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold'
  },
  valorCardTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});