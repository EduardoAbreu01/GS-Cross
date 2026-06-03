import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MissionContext = createContext();

export const MissionProvider = ({ children }) => {
  const [dadosSensores, setDadosSensores] = useState({
    energia: 87,
    sinal: 98,
    o2: 33,
    estrutura: 98,
  });


  const [limiares, setLimiares] = useState({
    energiaMin: 40,    
    sinalMax: 200,     
    o2Min: 15,         
    estruturaMin: 85,  
  });

  useEffect(() => {
    const carregarLimiares = async () => {
      try {
        const limiaresSalvos = await AsyncStorage.getItem('@limiares_missao');
        if (limiaresSalvos) {
          setLimiares(JSON.parse(limiaresSalvos));
        }
      } catch (error) {
        console.error("Erro ao carregar limiares do AsyncStorage:", error);
      }
    };
    carregarLimiares();
  }, []);


  const atualizarLimiares = async (novosLimiares) => {
    try {
      setLimiares(novosLimiares);
      await AsyncStorage.setItem('@limiares_missao', JSON.stringify(novosLimiares)); 
    } catch (error) {
      console.error("Erro ao salvar limiares no AsyncStorage:", error);
    }
  };

  return (
    <MissionContext.Provider value={{ dadosSensores, setDadosSensores, limiares, atualizarLimiares }}>
      {children}
    </MissionContext.Provider>
  );
};