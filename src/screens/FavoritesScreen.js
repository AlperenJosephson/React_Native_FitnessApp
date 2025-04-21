import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseHelper from '../database/DatabaseHelper';

// Egzersiz görsellerini tutan bir map objesi oluşturuyoruz
// NOT: Bu kısmı ExerciseScreen.js dosyanızdaki ile aynı tutmalısınız
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
  'barbell-bench-press-medium-grip': barbellBenchPress,
  'chest-dip': chestDip,
  'decline-dumbbell-flyes': declineDumbbellFlyes,
  'bodyweight-flyes': bodyweightFlyes,
  
  // Placeholder
  'placeholder': placeholderImage
};

const FavoritesScreen = ({ route }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userEmail } = route.params;
  const dbHelper = new DatabaseHelper();

  useEffect(() => {
    loadFavorites();
  }, []);

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

  const loadFavorites = async () => {
    try {
      console.log("loadFavorites çağrıldı, userEmail:", userEmail);
      setIsLoading(true);
      await dbHelper.initDatabase();
      const favoritesData = await dbHelper.getUserFavorites(userEmail);
      console.log("Yüklenen favoriler:", favoritesData);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Favoriler yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Favori egzersizler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFavorite = async (id) => {
    try {
      console.log("Silinecek favori ID:", id);
      
      Alert.alert(
        'Favoriden Çıkar',
        'Bu egzersizi favorilerden çıkarmak istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          { 
            text: 'Evet', 
            onPress: async () => {
              try {
                await dbHelper.deleteFavoriteExercise(id);
                console.log("Favori silme başarılı, ID:", id);
                // Listeyi güncelle
                loadFavorites();
                Alert.alert('Başarılı', 'Egzersiz favorilerden çıkarıldı.');
              } catch (deleteError) {
                console.error("Silme işlemi hatası:", deleteError);
                Alert.alert('Hata', 'Favori egzersiz silinirken bir sorun oluştu.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Favori silinirken hata oluştu:', error);
      Alert.alert('Hata', 'Favori egzersiz silinirken bir sorun oluştu.');
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={getExerciseImage(item.exercise_name)}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.exerciseName}>{item.exercise_name}</Text>
          <Text style={styles.muscleText}>Kas: {item.muscle}</Text>
          {item.difficulty && (
            <Text style={styles.difficultyText}>Zorluk: {item.difficulty}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteFavorite(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz favori eklenmedi!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  muscleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  difficultyText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default FavoritesScreen;