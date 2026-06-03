import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Cabecalho from '../../components/Header';
import { MissionContext } from '../../context/MissaoContext'; 

export default function Configuracoes() {
  const { limiares, atualizarLimiares } = useContext(MissionContext);

  const [form, setForm] = useState({
    energiaMin: String(limiares.energiaMin),
    sinalMax: String(limiares.sinalMax),
    o2Min: String(limiares.o2Min),
    estruturaMin: String(limiares.estruturaMin),
  });

  const [erros, setErros] = useState({});

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
    if (erros[campo]) {
      setErros({ ...erros, [campo]: null });
    }
  };

  const handleSalvar = () => {
    let novosErros = {};

    const energia = parseInt(form.energiaMin, 10);
    const sinal = parseInt(form.sinalMax, 10);
    const o2 = parseInt(form.o2Min, 10);
    const estrutura = parseInt(form.estruturaMin, 10);

    // Validação de Energia (0 a 100)
    if (isNaN(energia) || energia < 0 || energia > 100) {
      novosErros.energiaMin = "Insira um valor válido entre 0 e 100.";
    }
    // Validação de Sinal (Maior que 0)
    if (isNaN(sinal) || sinal < 0) {
      novosErros.sinalMax = "A latência deve ser um número positivo.";
    }
    // Validação de O2 (0 a 100)
    if (isNaN(o2) || o2 < 0 || o2 > 100) {
      novosErros.o2Min = "Insira um valor válido entre 0 e 100.";
    }
    // Validação de Estrutura (0 a 100)
    if (isNaN(estrutura) || estrutura < 0 || estrutura > 100) {
      novosErros.estruturaMin = "Insira um valor válido entre 0 e 100.";
    }

    // Se houver erros, impede o salvamento e mostra na tela
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    // Se passou na validação, atualiza o Contexto
    atualizarLimiares({
      energiaMin: energia,
      sinalMax: sinal,
      o2Min: o2,
      estruturaMin: estrutura,
    });

    Alert.alert("Sucesso", "Parâmetros da missão atualizados e sincronizados!");
  };

  return (
    <View style={styles.container}>
      <Cabecalho titulo={"Parâmetros de Alerta"} exibirBotaoVoltar={false} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.textoInstrucao}>
          Defina os limiares críticos para o disparo dos alarmes da missão.
        </Text>

        <View style={styles.grupoInput}>
          <Text style={styles.label}>Nível Mínimo de Energia (%)</Text>
          <TextInput
            style={[styles.input, erros.energiaMin && styles.inputErro]}
            keyboardType="numeric"
            value={form.energiaMin}
            onChangeText={(texto) => handleChange('energiaMin', texto)}
            placeholder="Ex: 40"
            placeholderTextColor="#555"
            maxLength={3}
          />
          {erros.energiaMin && <Text style={styles.textoErro}>{erros.energiaMin}</Text>}
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.label}>Latência Máxima Tolerável (ms)</Text>
          <TextInput
            style={[styles.input, erros.sinalMax && styles.inputErro]}
            keyboardType="numeric"
            value={form.sinalMax}
            onChangeText={(texto) => handleChange('sinalMax', texto)}
            placeholder="Ex: 200"
            placeholderTextColor="#555"
            maxLength={4}
          />
          {erros.sinalMax && <Text style={styles.textoErro}>{erros.sinalMax}</Text>}
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.label}>Nível Crítico de O² (%)</Text>
          <TextInput
            style={[styles.input, erros.o2Min && styles.inputErro]}
            keyboardType="numeric"
            value={form.o2Min}
            onChangeText={(texto) => handleChange('o2Min', texto)}
            placeholder="Ex: 15"
            placeholderTextColor="#555"
            maxLength={3}
          />
          {erros.o2Min && <Text style={styles.textoErro}>{erros.o2Min}</Text>}
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.label}>Integridade Estrutural Mínima (%)</Text>
          <TextInput
            style={[styles.input, erros.estruturaMin && styles.inputErro]}
            keyboardType="numeric"
            value={form.estruturaMin}
            onChangeText={(texto) => handleChange('estruturaMin', texto)}
            placeholder="Ex: 85"
            placeholderTextColor="#555"
            maxLength={3}
          />
          {erros.estruturaMin && <Text style={styles.textoErro}>{erros.estruturaMin}</Text>}
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <MaterialCommunityIcons name="content-save-cog-outline" size={24} color="#151515" />
          <Text style={styles.textoBotaoSalvar}>SALVAR CONFIGURAÇÕES</Text>
        </TouchableOpacity>

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
  textoInstrucao: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  grupoInput: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputErro: {
    borderColor: '#FF3333',
    backgroundColor: 'rgba(255, 51, 51, 0.05)',
  },
  textoErro: {
    color: '#FF3333',
    fontSize: 12,
    marginTop: 4,
  },
  botaoSalvar: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  textoBotaoSalvar: {
    color: '#151515',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
    letterSpacing: 1,
  },
});