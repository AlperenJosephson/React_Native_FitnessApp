import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { userSession } from './UserSession';
import DatabaseHelper from '../database/DatabaseHelper';

// Görsel dosyalarını statik olarak import ediyoruz
// Biceps egzersizleri
import inclineHammerCurls from './assets/images/inclinehammercurls.gif';
import wideGripBarbellCurl from './assets/images/wide-grip-barbell-curl.gif';
import ezBarCurl from './assets/images/ez-bar-curl.gif';
import hammerCurls from './assets/images/hammer-curls.gif';
import concentrationCurl from './assets/images/concentration-curl.gif';
import ezBarSpiderCurl from './assets/images/ez-bar-spider-curl.gif';
import zottmanCurl from './assets/images/zottman-curl.gif';
import bicepsCurlToShoulderPress from './assets/images/biceps-curl-to-shoulder-press.gif';
import barbellCurl from './assets/images/barbell-curl.gif';
import flexorInclineDumbbellCurls from './assets/images/flexor-incline-dumbbell-curls.gif';

// Chest egzersizleri
import dumbbellBenchPress from './assets/images/dumbbell-bench-press.gif';
import pushups from './assets/images/pushups.gif';
import closeGripBenchPress from './assets/images/close-grip-bench-press.gif';
import dumbbellFlyes from './assets/images/dumbbell-flyes.gif';
import inclineDumbbellBenchPress from './assets/images/incline-dumbbell-bench-press.gif';
import lowCableCrossOver from './assets/images/low-cable-cross-over.gif';
import barbellBenchPress from './assets/images/barbell-bench-press.gif';
import chestDip from './assets/images/chest-dip.gif';
import declineDumbbellFlyes from './assets/images/decline-dumbbell-flyes.gif';
import bodyweightFlyes from './assets/images/bodyweight-flyes.gif';

// Placeholder görsel
import placeholderImage from './assets/images/placeholder.png';

// Tüm görsel eşleştirmelerini bir map'te topluyoruz
const exerciseImages = {
  // Biceps egzersizleri
  'incline-hammer-curls': inclineHammerCurls,
  'wide-grip-barbell-curl': wideGripBarbellCurl,
  'ez-bar-curl': ezBarCurl,
  'hammer-curls': hammerCurls,
  'concentration-curl': concentrationCurl,
  'ez-bar-spider-curl': ezBarSpiderCurl,
  'zottman-curl': zottmanCurl,
  'biceps-curl-to-shoulder-press': bicepsCurlToShoulderPress,
  'barbell-curl': barbellCurl,
  'flexor-incline-dumbbell-curls': flexorInclineDumbbellCurls,
  
  // Chest egzersizleri
  'dumbbell-bench-press': dumbbellBenchPress,
  'pushups': pushups,
  'close-grip-bench-press': closeGripBenchPress,
  'dumbbell-flyes': dumbbellFlyes,
  'incline-dumbbell-bench-press': inclineDumbbellBenchPress,
  'low-cable-cross-over': lowCableCrossOver,
  'barbell-bench-press---medium-grip': barbellBenchPress,
  'chest-dip': chestDip,
  'decline-dumbbell-flyes': declineDumbbellFlyes,
  'bodyweight-flyes': bodyweightFlyes,
  
  // Placeholder
  'placeholder': placeholderImage
};

const ExerciseScreen = () => {
  const apiUrl = "https://api.api-ninjas.com/v1/exercises";
  const apiKey = "dqOSOqDyEDvX/mjtOSnamw==9CWVoGJdRSiPYYDm"; // APİ Key güvenlik amacıyla silindi
  
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState({});
  const dbHelper = new DatabaseHelper();

  useEffect(() => {
    fetchExercises();
  }, []);

  // API'den egzersizleri çek
  const fetchExercises = async () => {
    setIsLoading(true);

    try {
      // Biceps egzersizlerini çek
      const bicepsResponse = await fetch(`${apiUrl}?muscle=biceps`, {
        headers: { 'X-Api-Key': apiKey }
      });

      // Göğüs egzersizlerini çek
      const chestResponse = await fetch(`${apiUrl}?muscle=chest`, {
        headers: { 'X-Api-Key': apiKey }
      });

      if (bicepsResponse.ok && chestResponse.ok) {
        const bicepsData = await bicepsResponse.json();
        const chestData = await chestResponse.json();
        
        // İki veri setini birleştir
        const combinedData = [...bicepsData, ...chestData];
        
        // Show instructions objesi oluştur
        const instructionsObj = {};
        combinedData.forEach((_, index) => {
          instructionsObj[index] = false;
        });
        
        setExercises(combinedData);
        setShowInstructions(instructionsObj);
      } else {
        throw new Error('API Hatası');
      }
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Egzersiz verileri yüklenirken bir sorun oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Görsel dosyasını güvenli şekilde getir
  const getExerciseImage = (name) => {
    try {
      const formattedName = name.toLowerCase().replace(/\s+/g, '-');
      // Önce map'te bu isimle bir görsel var mı kontrol et
      return exerciseImages[formattedName] || placeholderImage;
    } catch (error) {
      console.error("Görsel yükleme hatası:", error);
      return placeholderImage;
    }
  };

  // Favorilere ekleme
  const addToFavorites = async (exercise) => {
    try {
      await dbHelper.initDatabase();
      
      if (userSession.getUser()?.email) {
        await dbHelper.addFavoriteExercise(userSession.getUser().email, exercise);
        Alert.alert("Başarılı", `${exercise.name} favorilere eklendi!`);
      } else {
        Alert.alert("Uyarı", "Lütfen giriş yapınız");
      }
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      Alert.alert("Hata", "Favorilere eklenirken bir sorun oluştu.");
    }
  };

  // Talimatları göster/gizle
  const toggleInstructions = (index) => {
    setShowInstructions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Egzersiz kartı bileşeni
  const renderExerciseItem = ({ item, index }) => {
    const exerciseName = item.name || 'Bilinmeyen Egzersiz';
    const instructions = item.instructions || 'Talimat mevcut değil';

    return (
      <View style={styles.card}>
        <View style={styles.exerciseHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={getExerciseImage(exerciseName)}
              style={styles.exerciseImage}
              resizeMode="cover"
              defaultSource={placeholderImage}
            />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exerciseName}</Text>
            <Text style={styles.exerciseDetails}>
              {item.muscle} - {item.difficulty}
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => toggleInstructions(index)}
          >
            <Text style={styles.buttonTextBlue}>
              {showInstructions[index] ? "Talimatları Gizle" : "Talimatları Göster"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => addToFavorites(item)}
          >
            <Text style={styles.buttonTextGreen}>Favorilere Ekle</Text>
          </TouchableOpacity>
        </View>
        
        {showInstructions[index] && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{instructions}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : (
        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item, index) => `exercise-${index}`}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 8,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  exerciseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonTextBlue: {
    color: '#2196F3',
    fontWeight: '500',
  },
  buttonTextGreen: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  instructionsContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  instructionsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default ExerciseScreen;