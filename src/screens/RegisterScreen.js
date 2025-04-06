import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatabaseHelper from '../database/DatabaseHelper';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const navigation = useNavigation();
  const dbHelper = new DatabaseHelper();

  // Form doğrulama fonksiyonu
  const validateForm = () => {
    let isValid = true;
    
    // Kullanıcı adı doğrulama
    if (username === '') {
      setUsernameError('Lütfen kullanıcı adı girin');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Kullanıcı adı en az 3 karakter olmalıdır');
      isValid = false;
    } else {
      setUsernameError('');
    }
    
    // Email doğrulama
    if (email === '') {
      setEmailError('Lütfen mail adresinizi girin');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Geçerli bir mail adresi girin');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Şifre doğrulama
    if (password === '') {
      setPasswordError('Lütfen şifrenizi girin');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Şifre en az 4 karakterden oluşmalıdır');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Şifre onaylama doğrulama
    if (confirmPassword === '') {
      setConfirmPasswordError('Lütfen şifrenizi tekrar girin');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  // Kayıt olma işlemi
  const handleRegister = async () => {
    if (validateForm()) {
      try {
        console.log('Veritabanı başlatılıyor...');
        await dbHelper.initDatabase();
        
        console.log('Kullanıcı ekleniyor:', { username, email });
        const userId = await dbHelper.insertUser({
          username,
          email,
          password
        });
        
        console.log('Kullanıcı başarıyla eklendi. ID:', userId);
        
        // Doğrulama için kullanıcıyı hemen sorgulayalım
        const users = await dbHelper.getAllUsers();
        console.log('Tüm kullanıcılar:', users);
        
        Alert.alert(
          'Başarılı',
          'Kayıt işlemi tamamlandı. Şimdi giriş yapabilirsiniz.',
          [{ 
            text: 'Tamam', 
            onPress: () => navigation.navigate('Login')
          }]
        );
      } catch (error) {
        console.error('Kayıt hatası (detaylı):', error.message);
        Alert.alert(
          'Hata',
          'Bu e-posta adresi zaten kayıtlı veya kayıt sırasında bir hata oluştu.'
        );
      }
    }
  };

  // Giriş ekranına yönlendirme
  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Alanı</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        
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
        
        <TextInput
          style={styles.input}
          placeholder="Şifre Tekrar"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginText}>Zaten hesabınız var mı? Giriş Yap</Text>
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
  registerButton: {
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
  loginText: {
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;