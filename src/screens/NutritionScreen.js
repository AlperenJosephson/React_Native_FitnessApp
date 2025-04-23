import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList
} from 'react-native';

// Resim importları
import avokadoluYumurtaImage from './assets/images/avokadolu-yumurta.jpg';
import smoothieBowlImage from './assets/images/smoothie-bowl.jpg';
import tavukluKinoaSalataImage from './assets/images/tavuklu-kinoa-salata.jpg';
import placeholderImage from './assets/images/placeholder.png';

const NutritionScreen = () => {
  // Tarif verilerini oluştur
  const recipes = [
    {
      id: '1',
      name: 'Avokadolu Yumurta',
      description: 'Protein ve sağlıklı yağ kaynağı!',
      details:
        'Malzemeler:\n- 2 dilim tam buğday ekmeği\n- 1 adet avokado\n- 2 adet haşlanmış yumurta\n- Tuz, karabiber, pul biber\n\nHazırlanışı:\nAvokadoyu ezin ve ekmek üzerine sürün. Üzerine dilimlenmiş haşlanmış yumurta ekleyin. Tuz, karabiber ve pul biber serpin.',
      image: avokadoluYumurtaImage
    },
    {
      id: '2',
      name: 'Smoothie Bowl',
      description: 'Lezzetli ve vitamin dolu bir başlangıç.',
      details:
        'Malzemeler:\n- 1 adet muz\n- 1/2 su bardağı yulaf\n- 1 su bardağı süt\n- 1 yemek kaşığı fıstık ezmesi\n- Üzeri için: çilek, yaban mersini, ceviz\n\nHazırlanışı:\nTüm malzemeleri blenderda karıştırın. Kaseye dökün ve üzerini meyveler ve cevizle süsleyin.',
      image: smoothieBowlImage
    },
    {
      id: '3',
      name: 'Tavuklu Kinoa Salatası',
      description: 'Düşük kalorili ve doyurucu bir öğün.',
      details:
        'Malzemeler:\n- 1 su bardağı haşlanmış kinoa\n- 100 gr ızgara tavuk\n- 1 adet salatalık\n- 1 adet domates\n- Zeytinyağı, limon suyu, tuz\n\nHazırlanışı:\nTüm malzemeleri küp küp doğrayın ve haşlanmış kinoayla karıştırın. Zeytinyağı, limon suyu ve tuz ekleyerek servis yapın.',
      image: tavukluKinoaSalataImage
    },
  ];

  // Detayların görünürlüğünü takip eden state
  const [showDetails, setShowDetails] = useState({});

  // Detayları göster/gizle fonksiyonu
  const toggleDetails = (id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Tarif kartını render et
  const renderRecipeItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image 
          source={item.image || placeholderImage}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.detailsButton} 
          onPress={() => toggleDetails(item.id)}
        >
          <Text style={styles.buttonText}>
            {showDetails[item.id] ? "Detayları Gizle" : "Detayları Göster"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showDetails[item.id] && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>{item.details}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NutritionScreen;