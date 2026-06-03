import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: '#FDEBD0'}}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Resumo da Missão',
          headerShown: false,
          tabBarStyle: { backgroundColor: '#FF6B35' },
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="climaBases"
        options={{
          title: 'Lançamentos',
          headerShown: false,
          tabBarStyle: { backgroundColor: '#FF6B35' },
          tabBarIcon: ({ color }) => <Ionicons name="rocket-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="configAlertas"
        options={{
          title: 'Configuração',
          headerShown:false,
          tabBarStyle: { backgroundColor: '#FF6B35' },
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}