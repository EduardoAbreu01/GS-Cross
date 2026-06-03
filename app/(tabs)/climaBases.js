import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Cabecalho from '../../components/Header';
import basesJSON from '../../jsons/dataBases.json'; 

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY; 
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function ClimaLancamentos() {
  const [baseSelecionada, setBaseSelecionada] = useState(basesJSON[0]);
  const [dadosClima, setDadosClima] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  
  const [analiseIA, setAnaliseIA] = useState(null);
  const [carregandoIA, setCarregandoIA] = useState(false);

  // Cpnverte para KM por hora
  const formatarVento = (ms) => (ms * 3.6).toFixed(1);

  // Função que faz a busca na API Externa
  const buscarClima = async (base) => {
    setCarregando(true);
    setErro(null);
    setAnaliseIA(null); 
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${base.lat}&lon=${base.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (resposta.ok) {
        setDadosClima(dados);
      } else {
        setErro(dados.message || "Erro ao buscar dados climáticos.");
      }
    } catch (error) {
      setErro("Falha na conexão com a API de clima.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarClima(baseSelecionada);
  }, [baseSelecionada]);


  // Função que envia os dados retornados pela API para o Agente de IA
  const gerarDiagnosticoIA = async () => {
    if (!dadosClima) return;
    
    setCarregandoIA(true);
    
    const ventoKm = formatarVento(dadosClima.wind.speed);
    const temp = Math.round(dadosClima.main.temp);
    const nuvens = dadosClima.clouds.all;
    const climaDescricao = dadosClima.weather[0].description;
    
    const prompt = `Você é o Diretor de Voo da missão. Analise as condições atuais na base ${baseSelecionada.nome}: Vento a ${ventoKm} km/h, Temperatura de ${temp}°C, Nuvens em ${nuvens}%, condição geral: ${climaDescricao}. 
    Responda em até 3 linhas de foorma técnica e direta se o clima está propicio para lançamentos de foguetes, lembre-se caso o clima estiver minimamente perigoso o melhor a se fazer é adiar.`;

    try {

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const resposta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const dados = await resposta.json();
      
      
      if (resposta.ok && dados.candidates && dados.candidates.length > 0) {
        setAnaliseIA(dados.candidates[0].content.parts[0].text);
      } else {
        const mensagemErro = dados.error?.message || "Resposta inválida da IA.";
        setAnaliseIA(`Falha na IA: ${mensagemErro}`);
      }
    } catch (error) {
      console.error("Erro crítico no fetch da IA:", error);
      setAnaliseIA("Erro de conexão ao tentar alcançar o servidor da IA.");
    } finally {
      setCarregandoIA(false);
    }
  };

  return (
    <View style={styles.container}>
      <Cabecalho titulo="Clima Orbital & Preditivo" exibirBotaoVoltar={false} />

      <View style={styles.conteudo}>
        <Text style={styles.subtitulo}>Base de Lançamento:</Text>
        
        <View style={styles.secaoBotoes}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {basesJSON.map((base) => (
              <TouchableOpacity
                key={base.id}
                style={[styles.botaoBase, baseSelecionada.id === base.id && styles.botaoBaseAtivo]}
                onPress={() => setBaseSelecionada(base)}
              >
                <Text style={[styles.textoBotaoBase, baseSelecionada.id === base.id && styles.textoBotaoBaseAtivo]}>
                  {base.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.areaDados}>
          {carregando ? (
            <View style={styles.centro}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.textoCarregando}>Buscando telemetria climática...</Text>
            </View>
          ) : erro ? (
            <View style={styles.centro}>
              <Text style={styles.textoErro}>{erro}</Text>
            </View>
          ) : dadosClima ? (
            <>
              <View style={styles.gradeCards}>
                {/* Card do Vento */}
                <View style={styles.cardInfo}>
                  <MaterialCommunityIcons name="weather-windy" size={28} color="#FF6B35" />
                  <Text style={styles.cardValor}>{formatarVento(dadosClima.wind.speed)} km/h</Text>
                  <Text style={styles.cardLabel}>Vento</Text>
                </View>

                {/* Card de Umidade */}
                <View style={styles.cardInfo}>
                  <MaterialCommunityIcons name="water-percent" size={28} color="#FF6B35" />
                  <Text style={styles.cardValor}>{dadosClima.main.humidity}%</Text>
                  <Text style={styles.cardLabel}>Umidade</Text>
                </View>

                {/* Card de Pressão Atmosférica */}
                <View style={styles.cardInfo}>
                  <MaterialCommunityIcons name="gauge" size={28} color="#FF6B35" />
                  <Text style={styles.cardValor}>{dadosClima.main.pressure} hPa</Text>
                  <Text style={styles.cardLabel}>Pressão</Text>
                </View>

                {/* Card de Cobertura de Nuvens */}
                <View style={styles.cardInfo}>
                  <MaterialCommunityIcons name="cloud-percent" size={28} color="#FF6B35" />
                  <Text style={styles.cardValor}>{dadosClima.clouds.all}%</Text>
                  <Text style={styles.cardLabel}>Nuvens</Text>
                </View>
              </View>

              {/* Área da IA  */}
              <View style={styles.secaoIA}>
                <Text style={styles.tituloIA}>
                  <MaterialCommunityIcons name="brain" size={20} color="#FF6B35" /> Diagnóstico Preditivo (IA)
                </Text>
                
                {!analiseIA && !carregandoIA && (
                  <TouchableOpacity style={styles.botaoIA} onPress={gerarDiagnosticoIA}>
                    <Text style={styles.textoBotaoIA}>GERAR ANÁLISE DE RISCO</Text>
                  </TouchableOpacity>
                )}

                {carregandoIA && (
                  <View style={styles.loadingIA}>
                    <ActivityIndicator size="small" color="#FF6B35" />
                    <Text style={styles.textoLoadingIA}>Processando redes neurais...</Text>
                  </View>
                )}

                {analiseIA && (
                  <View style={styles.caixaResultadoIA}>
                    <Text style={styles.textoResultadoIA}>{analiseIA}</Text>
                    <TouchableOpacity style={styles.botaoRecarregarIA} onPress={gerarDiagnosticoIA}>
                      <MaterialCommunityIcons name="refresh" size={20} color="#4992ea" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

            </>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#151515' 
  },
  conteudo: { 
    flex: 1 
  },
  subtitulo: { 
    color: '#A0A0A0', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginLeft: 20, 
    marginTop: 20, 
    marginBottom: 10, 

  },
  secaoBotoes: { 
    paddingLeft: 20, 
    marginBottom: 20 
  },
  botaoBase: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    backgroundColor: '#1E1E1E', 
    borderRadius: 20, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#2A2A2A' 
  },
  botaoBaseAtivo: { 
    backgroundColor: '#FF6B35', 
    borderColor: '#FF6B35' 
  },
  textoBotaoBase: { 
    color: '#A0A0A0', 
    fontWeight: '600' 
  },
  textoBotaoBaseAtivo: { 
    color: '#151515', 
    fontWeight: 'bold' 
  },
  areaDados: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  centro: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 50 
  },
  textoCarregando: { 
    color: '#888', 
    marginTop: 16 
  },
  textoErro: { 
    color: '#FF3333', 
    marginTop: 16, 
    textAlign: 'center' 
  },
  gradeCards: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 20
  },
  cardInfo: { 
    width: '48%', 
    backgroundColor: '#1E1E1E', 
    borderRadius: 12, 
    padding: 16,
    marginBottom: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#2A2A2A' 
  },
  cardValor: { 
    color: '#FFFFFF', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  cardLabel: { 
    color: '#888888', 
    fontSize: 12, 
    marginTop: 4, 
    textTransform: 'uppercase', 
    textAlign: 'center' 
  },

  secaoIA: {
    backgroundColor:"#1E1E1E", 
    padding: 20, 
    marginTop: 10 
  },
  tituloIA: { 
    color: '#FF6B35', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  botaoIA: { 
    backgroundColor: '#FF6B35', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  textoBotaoIA: { 
    color: '#151515', 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  loadingIA: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 15 
  },
  textoLoadingIA: { 
    color: '#FF6B35', 
    marginLeft: 10,  
  },
  caixaResultadoIA: { 
    backgroundColor: '#1E1E1E', 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  textoResultadoIA: { 
    color: '#E0E0E0', 
    fontSize: 14, 
    lineHeight: 22, 
    flex: 1, 
    marginRight: 10 
  },
  botaoRecarregarIA: { 
    padding: 5, 
    backgroundColor: '#6B6B8A', 
    borderRadius: 20 
  }
});