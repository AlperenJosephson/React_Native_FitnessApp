import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userSession } from './UserSession';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { username, email } = route.params || {};

  // Email kontrolü
  useEffect(() => {
    console.log("HomeScreen email:", email);
  }, [email]);

  const handleLogout = () => {
    // Kullanıcı oturumunu kapat
    userSession.logout();
    // Login ekranına geri dön
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş Geldin, {username}!</Text>
      <Text style={styles.emailText}>{email}</Text>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Exercise')}
        >
          <Text style={styles.menuItemText}>Egzersizler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            if (email) {
              console.log("Navigating to Favorites with email:", email);
              navigation.navigate('Favorites', { userEmail: email });
            } else {
              console.error("Email is undefined");
              alert("Oturum bilgisi alınamadı. Lütfen tekrar giriş yapın.");
            }
          }}
        >
          <Text style={styles.menuItemText}>Favorilerim</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Nutrition')}
        >
          <Text style={styles.menuItemText}>Beslenme</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.menuItemText}>Profil</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  menuContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    height: 100,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 'auto',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;