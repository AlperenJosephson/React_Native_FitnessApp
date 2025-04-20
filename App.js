import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Ekranları import et
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';

// Veritabanı
import DatabaseHelper from './src/database/DatabaseHelper';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const dbHelper = new DatabaseHelper();
        
        console.log('Veritabanı başarıyla başlatıldı');
      } catch (error) {
        console.error('Veritabanı başlatma hatası:', error);
      }
    };
  
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Giriş' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Kayıt Ol' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Ana Sayfa',
            headerBackVisible: false
          }}
        />
        <Stack.Screen
          name="Exercise"
          component={ExerciseScreen}
          options={{ title: 'Egzersizler'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;