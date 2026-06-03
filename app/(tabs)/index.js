import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { MissionContext } from '../../context/MissaoContext';
import CartaoResumo from '../../components/CartaoResumo';
import Alerta from '../../components/Alerta';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import dadosSimulados from '../../jsons/dataNave.json';

export default function Index() {
  //Recebe os dados salvos
  const { dadosSensores, setDadosSensores, limiares } = useContext(MissionContext);

  const [indiceLeitura, setIndiceLeitura] = useState(0);

  const router = useRouter();

  // Limiares para alerta
  const alertaEnergia = dadosSensores.energia < limiares.energiaMin;
  const alertaSinal = dadosSensores.sinal > limiares.sinalMax;
  const alertaO2 = dadosSensores.o2 < limiares.o2Min;
  const alertaEstrutura = dadosSensores.estrutura < limiares.estruturaMin;

  const statusGeral = (alertaEnergia || alertaSinal || alertaO2 || alertaEstrutura)
    ? 'OPERAÇÃO COMPROMETIDA'
    : 'OPERAÇÕES NORMAIS';

  const alertasAtivos = [];

  // Emite os Alertas 
  if (alertaEnergia) {
    alertasAtivos.push({
      id: 'energia',
      mensagem: `Bateria em nível crítico (${dadosSensores.energia}%). Risco de desligamento.`,
      tipo: 'critico'
    });
  }
  if (alertaO2) {
    alertasAtivos.push({
      id: 'o2',
      mensagem: `Suporte à vida comprometido. O² caiu para ${dadosSensores.o2}%.`,
      tipo: 'critico'
    });
  }
  if (alertaEstrutura) {
    alertasAtivos.push({
      id: 'estrutura',
      mensagem: `Micro-impacto detectado. Integridade em ${dadosSensores.estrutura}%.`,
      tipo: 'aviso'
    });
  }
  if (alertaSinal) {
    alertasAtivos.push({
      id: 'sinal',
      mensagem: `Latência de telemetria alta detectada (${dadosSensores.sinal}ms).`,
      tipo: 'aviso'
    });
  }

  //Atualiza os dados
  const simularNovaLeitura = () => {
    const proximoIndice = (indiceLeitura + 1) % dadosSimulados.length;

    setIndiceLeitura(proximoIndice);

    setDadosSensores(dadosSimulados[proximoIndice]);
  };

  return (
    <ScrollView style={estilos.telaPrincipal} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.secaoCabecalho}>
        <Text style={estilos.titulo}>Painel de Controle</Text>
        <Text style={estilos.subtitulo}>Missão Artemis V - Status Global</Text>

        <View>
          <Text style={[
            estilos.textoStatus,
            statusGeral === 'OPERAÇÃO COMPROMETIDA' ? { color: '#FF3333' } : {}
          ]}>
            {statusGeral}
          </Text>
        </View>
      </View>

      <View style={estilos.grade}></View>
      <View style={estilos.grade}>
        {/* Card de Energia */}
        <CartaoResumo
          icone="battery-charging"
          titulo="Energia"
          valor={`${dadosSensores.energia}%`}
          textoSecundario="Bateria / Painéis solares"
          emAlerta={alertaEnergia}
          onPress={() => router.push("/energia")}
        />
        {/* Card de Sinal */}
        <CartaoResumo
          icone="radio"
          titulo="Sinal"
          valor={`${dadosSensores.sinal}ms`}
          textoSecundario="Latência de telemetria"
          emAlerta={alertaSinal}
          onPress={() => router.push("/sinal")}
        />
        {/* Card de Oxigênio */}
        <CartaoResumo
          icone="leaf"
          titulo="O²"
          valor={`${dadosSensores.o2}%`}
          textoSecundario="Nível de Oxigênio"
          emAlerta={alertaO2}
          onPress={() => router.push("/oxigenio")}
        />
        {/* Card de Estrutura */}
        <CartaoResumo
          icone="build"
          titulo="Estrutura"
          valor={`${dadosSensores.estrutura}%`}
          textoSecundario="Integridade do Casco"
          emAlerta={alertaEstrutura}
          onPress={() => router.push("/estrutura")}
        />
      </View>
      {/* Botão de Atualizar Dados */}
      <TouchableOpacity
        style={estilos.botaoSimular}
        onPress={simularNovaLeitura}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="satellite-uplink" size={24} color="#151515" />
        <Text style={estilos.textoBotaoSimular}>
          ATUALIZAR TELEMETRIA
        </Text>
      </TouchableOpacity>
      <Alerta alertas={alertasAtivos} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  telaPrincipal: {
    flex: 1,
    backgroundColor: '#151515',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  secaoCabecalho: {
    marginTop: 10,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitulo: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 4,
    marginBottom: 8
  },
  textoStatus: {
    color: '#32CD32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  botaoSimular: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textoBotaoSimular: {
    color: '#151515',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  }
});