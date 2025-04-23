import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Ekranları import et 
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CalorieScreen from './src/screens/CalorieScreen';
import NutritionScreen from './src/screens/NutritionScreen';

// Veritabanı
import DatabaseHelper from './src/database/DatabaseHelper';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const dbHelper = new DatabaseHelper();
        await dbHelper.initDatabase();
        console.log('Veritabanı başarıyla başlatıldı');
      } catch (error) {
        console.error('Veritabanı başlatma hatası:', error);
      }
    };
  
    initDatabase();
  }, []);

  /* Uygulamanın hangi ekranda olduğunu hangi ekranlar arasında geçiş yapabileceğini belirlediğimiz alan*/ 
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
        <Stack.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{ title: 'Favori Egzersizler' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Kişisel Sağlık Verileri' }}
        />
        <Stack.Screen 
          name="Calorie" 
          component={CalorieScreen}
          options={{ title: 'Kalori Hesaplama' }}
        />
        <Stack.Screen 
          name="Nutrition" 
          component={NutritionScreen}
          options={{ title: 'Beslenme Desteği' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;