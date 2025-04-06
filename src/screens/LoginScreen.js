import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatabaseHelper from '../database/DatabaseHelper';
import { userSession } from './UserSession';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();
  const dbHelper = new DatabaseHelper();

  // Form doğrulama fonksiyonu
  const validateForm = () => {
    let isValid = true;
    
    // Email doğrulama
    if (email === '') {
      setEmailError('Lütfen Mail adresinizi girin');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Geçerli bir mail adresi girin');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Şifre doğrulama
    if (password === '') {
      setPasswordError('Lütfen Şifrenizi girin');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Şifre en az 4 karakterden oluşmalıdır');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  // Giriş yapma işlemi
  const handleLogin = async () => {
    if (validateForm()) {
      try {
        // Veritabanını başlat
        await dbHelper.initDatabase();
        
        // Kullanıcı doğrulama
        const isAuthenticated = await dbHelper.authenticateUser(email, password);
        
        if (isAuthenticated) {
          try {
            // Kullanıcı bilgilerini al
            const users = await dbHelper.getAllUsers();
            const user = users.find(u => u.email === email);
            
            // Kullanıcı oturumunu ayarla
            userSession.setUser({
              email: user.email,
              username: user.username,
            });
            
            // Ana sayfaya yönlendir
            navigation.replace('Home', {
              username: user.username,
              email: user.email,
            });
          } catch (e) {
            Alert.alert('Hata', 'Kullanıcı Kayıtlı Değil.');
          }
        } else {
          Alert.alert('Hata', 'Geçersiz Mail veya Şifre');
        }
      } catch (error) {
        console.error('Giriş yapma hatası:', error);
        Alert.alert('Hata', 'Giriş yapılırken bir sorun oluştu.');
      }
    }
  };

  // Kayıt ekranına yönlendirme
  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Alanı</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.registerText}>Hesabınız yok mu? Kayıt Ol!!!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerText: {
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;