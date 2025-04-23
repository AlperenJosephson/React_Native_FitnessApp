import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CalorieScreen = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Erkek');
  const [activityLevel, setActivityLevel] = useState('Hareketsiz');
  const [calorieRequirement, setCalorieRequirement] = useState(null);
  
  const [weightError, setWeightError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [ageError, setAgeError] = useState('');

  const calorieList = [
    {id: '1', name: 'Elma', calories: '52'},
    {id: '2', name: 'Muz', calories: '89'},
    {id: '3', name: 'Tavuk Göğsü (100 gr)', calories: '165'},
    {id: '4', name: 'Beyaz Ekmek (1 dilim)', calories: '79'},
    {id: '5', name: 'Süt (1 su bardağı)', calories: '103'},
    {id: '6', name: 'Cips (1 küçük paket)', calories: '152'},
    {id: '7', name: 'Çikolata (100 gr)', calories: '545'},
    {id: '8', name: 'Hamburger', calories: '295'},
    {id: '9', name: 'Pizza (1 dilim)', calories: '285'},
    {id: '10', name: 'Yoğurt (1 su bardağı)', calories: '59'},
    {id: '11', name: 'Pirinç Pilavı (100 gr)', calories: '130'},
    {id: '12', name: 'Kola (1 kutu)', calories: '139'},
  ];

  const calculateCalories = (gender, weight, height, age, activityLevel) => {
    let bmr;

    if (gender === 'Erkek') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    switch (activityLevel) {
      case 'Hareketsiz':
        return bmr * 1.2;
      case 'Hafif Aktif':
        return bmr * 1.375;
      case 'Orta Aktif':
        return bmr * 1.55;
      case 'Çok Aktif':
        return bmr * 1.725;
      case 'Aşırı Aktif':
        return bmr * 1.9;
      default:
        return bmr;
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!weight) {
      setWeightError('Kilo bilgisi zorunludur');
      isValid = false;
    } else {
      setWeightError('');
    }
    
    if (!height) {
      setHeightError('Boy bilgisi zorunludur');
      isValid = false;
    } else {
      setHeightError('');
    }
    
    if (!age) {
      setAgeError('Yaş bilgisi zorunludur');
      isValid = false;
    } else {
      setAgeError('');
    }
    
    return isValid;
  };

  const calculate = () => {
    if (validateForm()) {
      const weightVal = parseFloat(weight);
      const heightVal = parseFloat(height);
      const ageVal = parseInt(age);
      
      const result = calculateCalories(gender, weightVal, heightVal, ageVal, activityLevel);
      setCalorieRequirement(result);
    }
  };

  const renderCalorieItem = ({ item }) => (
    <View style={styles.calorieItem}>
      <Text style={styles.calorieName}>{item.name}</Text>
      <Text style={styles.calorieValue}>{item.calories} kcal</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Kilo (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
          
          <TextInput
            style={styles.input}
            placeholder="Boy (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
          
          <TextInput
            style={styles.input}
            placeholder="Yaş"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Cinsiyet</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Erkek" value="Erkek" />
              <Picker.Item label="Kadın" value="Kadın" />
            </Picker>
          </View>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Aktivite Düzeyi</Text>
            <Picker
              selectedValue={activityLevel}
              onValueChange={(itemValue) => setActivityLevel(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Hareketsiz" value="Hareketsiz" />
              <Picker.Item label="Hafif Aktif" value="Hafif Aktif" />
              <Picker.Item label="Orta Aktif" value="Orta Aktif" />
              <Picker.Item label="Çok Aktif" value="Çok Aktif" />
              <Picker.Item label="Aşırı Aktif" value="Aşırı Aktif" />
            </Picker>
          </View>
          
          <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
            <Text style={styles.buttonText}>Hesapla</Text>
          </TouchableOpacity>
          
          {calorieRequirement !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Günlük Kalori İhtiyacı: {calorieRequirement.toFixed(2)} kcal
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.calorieListContainer}>
          <Text style={styles.calorieListTitle}>Besin Kalori Listesi</Text>
          
          <FlatList
            data={calorieList}
            renderItem={renderCalorieItem}
            keyExtractor={item => item.id}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            style={{ maxHeight: 400 }}
          />
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
    marginBottom: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  calculateButton: {
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
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  calorieListContainer: {
    marginTop: 20,
  },
  calorieListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  calorieItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  calorieName: {
    fontSize: 16,
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalorieScreen;