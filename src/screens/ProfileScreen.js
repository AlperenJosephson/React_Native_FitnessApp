import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { userSession } from './UserSession';
import DatabaseHelper from '../database/DatabaseHelper';

const ProfileScreen = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [steps, setSteps] = useState('');
  const [healthData, setHealthData] = useState([]);
  
  const dbHelper = new DatabaseHelper();

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const currentUser = userSession.getUser();
      if (currentUser && currentUser.email) {
        await dbHelper.initDatabase();
        const data = await dbHelper.getHealthData(currentUser.email);
        setHealthData(data);
      } else {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
      }
    } catch (error) {
      console.error('Sağlık verileri yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Sağlık verileri yüklenirken bir sorun oluştu.');
    }
  };

  const saveHealthData = async () => {
    if (!validateForm()) return;
    
    try {
      const currentUser = userSession.getUser();
      if (currentUser && currentUser.email) {
        await dbHelper.initDatabase();
        
        const healthDataObj = {
          height: parseFloat(height),
          weight: parseFloat(weight),
          exercise_duration: parseInt(exerciseDuration),
          steps: parseInt(steps)
        };
        
        await dbHelper.insertHealthData(currentUser.email, healthDataObj);
        
        // BMI hesapla
        const bmiStatus = calculateBMI(parseFloat(height), parseFloat(weight));
        Alert.alert('Başarılı', `Veriler Kaydedildi! BMI Durumu: ${bmiStatus}`);
        
        // Formu temizle
        setHeight('');
        setWeight('');
        setExerciseDuration('');
        setSteps('');
        
        // Verileri yenile
        loadHealthData();
      } else {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
      }
    } catch (error) {
      console.error('Sağlık verisi kaydedilirken hata oluştu:', error);
      Alert.alert('Hata', 'Sağlık verisi kaydedilirken bir sorun oluştu.');
    }
  };

  const validateForm = () => {
    if (!height.trim()) {
      Alert.alert('Hata', 'Boy bilgisi zorunludur');
      return false;
    }
    if (!weight.trim()) {
      Alert.alert('Hata', 'Kilo bilgisi zorunludur');
      return false;
    }
    if (!exerciseDuration.trim()) {
      Alert.alert('Hata', 'Egzersiz süresi zorunludur');
      return false;
    }
    if (!steps.trim()) {
      Alert.alert('Hata', 'Adım sayısı zorunludur');
      return false;
    }
    return true;
  };

  const calculateBMI = (height, weight) => {
    const bmi = weight / ((height / 100) * (height / 100)); // Boyu metreye çevir
    if (bmi < 18.5) {
      return 'Zayıf';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return 'Normal';
    } else if (bmi >= 25 && bmi < 29.9) {
      return 'Fazla Kilolu';
    } else {
      return 'Obez';
    }
  };

  const renderHealthDataItem = ({ item }) => {
    const date = new Date(item.entry_date).toLocaleString();
    
    return (
      <View style={styles.card}>
        <Text style={styles.dateText}>Tarih: {date}</Text>
        <Text style={styles.dataText}>Boy: {item.height} cm</Text>
        <Text style={styles.dataText}>Kilo: {item.weight} kg</Text>
        <Text style={styles.dataText}>Egzersiz: {item.exercise_duration} dk</Text>
        <Text style={styles.dataText}>Adım: {item.steps}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Boy (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Kilo (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Egzersiz Süresi (dk)"
            keyboardType="numeric"
            value={exerciseDuration}
            onChangeText={setExerciseDuration}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Adım Sayısı"
            keyboardType="numeric"
            value={steps}
            onChangeText={setSteps}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={saveHealthData}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dataListContainer}>
          <Text style={styles.sectionTitle}>Kayıtlı Veriler</Text>
          
          {healthData.length === 0 ? (
            <Text style={styles.emptyText}>Henüz veri bulunmuyor.</Text>
          ) : (
            <FlatList
              data={healthData}
              renderItem={renderHealthDataItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false} // ScrollView içinde olduğu için
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataListContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default ProfileScreen;