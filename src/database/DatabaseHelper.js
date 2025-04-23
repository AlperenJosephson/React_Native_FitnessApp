import * as SQLite from 'expo-sqlite';

class DatabaseHelper {
  static instance = null;

  constructor() {
    if (DatabaseHelper.instance) {
      return DatabaseHelper.instance;
    }
    
    this.database = null;
    DatabaseHelper.instance = this;
  }

  async initDatabase() {
    try {
      if (this.database) return this.database;
      
      this.database = await SQLite.openDatabaseAsync('app_database.db');
      
      // Kullanıcı tablosu oluşturma alanı 
      // id, username, email ve password'u olacak
      await this.database.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);
      
      // Favoriler tablosu burada mail adresi ortak alan seçildiğinden kişisel veriler o mail adresine göre çekilecek
      await this.database.execAsync(`
        CREATE TABLE IF NOT EXISTS user_favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_email TEXT NOT NULL,
          exercise_name TEXT NOT NULL,
          muscle TEXT,
          equipment TEXT,
          difficulty TEXT,
          instructions TEXT,
          FOREIGN KEY (user_email) REFERENCES users(email)
        );
      `);
      
      // Sağlık verileri tablosu
      await this.database.execAsync(`
        CREATE TABLE IF NOT EXISTS user_health_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_email TEXT NOT NULL,
          height REAL NOT NULL,
          weight REAL NOT NULL,
          exercise_duration INTEGER NOT NULL,
          steps INTEGER NOT NULL,
          entry_date TEXT NOT NULL,
          FOREIGN KEY (user_email) REFERENCES users(email)
        );
      `);
      
      console.log('Veritabanı tabloları başarıyla oluşturuldu');
      return this.database;
    } catch (error) {
      console.error('Veritabanı başlatma hatası:', error);
      throw error;
    }
  }

  async getDatabase() {
    if (!this.database) {
      await this.initDatabase();
    }
    return this.database;
  }

  // Kullanıcı ekleme
  async insertUser(user) {
    try {
      const db = await this.getDatabase();
      const { username, email, password } = user;
      
      console.log('Veritabanı bağlantısı:', db ? 'Başarılı' : 'Başarısız');
      console.log('SQL sorgusu hazırlanıyor:', { username, email, password });
      
      // String interpolation yerine parametre kullanma
      await db.execAsync(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      
      // En son eklenen kullanıcının ID'sini almak için ayrı bir sorgu çalıştır
      const result = await db.getAllAsync(
        'SELECT last_insert_rowid() as id'
      );
      
      console.log('Son eklenen ID sorgusu sonucu:', result);
      return result[0]?.id || 0;
    } catch (error) {
      console.error('Kullanıcı ekleme hatası (detaylı):', error);
      console.error('Hata mesajı:', error.message);
      throw error;
    }
  }

  // Kullanıcı doğrulama
  async authenticateUser(email, password) {
    try {
      const db = await this.getDatabase();
      
      const result = await db.getAllAsync(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password]
      );
      
      return result.length > 0;
    } catch (error) {
      console.error('Kullanıcı doğrulama hatası:', error);
      throw error;
    }
  }

  // Kullanıcının favori egzersizlerini ekleme
  async addFavoriteExercise(userEmail, exercise) {
    try {
      if (!userEmail) {
        console.error("addFavoriteExercise: userEmail null veya undefined!");
        throw new Error("Email gerekli");
      }
      
      console.log("addFavoriteExercise çağrıldı:", { 
        userEmail, 
        exerciseName: exercise.name,
        muscle: exercise.muscle 
      });
      
      const db = await this.getDatabase();
      
      const result = await db.execAsync(
        'INSERT INTO user_favorites (user_email, exercise_name, muscle, equipment, difficulty, instructions) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userEmail,
          exercise.name,
          exercise.muscle,
          exercise.equipment,
          exercise.difficulty,
          exercise.instructions
        ]
      );
      
      console.log("Favori ekleme sonucu:", result);
      return result;
    } catch (error) {
      console.error('Favori egzersiz ekleme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının favori egzersizlerini çekme
  async getUserFavorites(userEmail) {
    try {
      if (!userEmail) {
        console.error("getUserFavorites: userEmail null veya undefined!");
        return [];
      }
      
      console.log("getUserFavorites çağrıldı, email:", userEmail);
      const db = await this.getDatabase();
      
      const result = await db.getAllAsync(
        'SELECT * FROM user_favorites WHERE user_email = ?',
        [userEmail]
      );
      
      console.log(`${result.length} adet favori bulundu`);
      return result;
    } catch (error) {
      console.error('Favori egzersizleri getirme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının favori egzersizini silme
  async deleteFavoriteExercise(id) {
    try {
      if (!id) {
        console.error("deleteFavoriteExercise: id null veya undefined!");
        throw new Error("ID gerekli");
      }
      
      console.log("deleteFavoriteExercise çağrıldı, id:", id);
      const db = await this.getDatabase();
      
      // Önce silinecek kaydı kontrol edelim
      const checkResult = await db.getAllAsync(
        'SELECT * FROM user_favorites WHERE id = ?',
        [id]
      );
      
      console.log(`Silme kontrolü: ${checkResult.length} adet eşleşen kayıt bulundu`);
      
      if (checkResult.length === 0) {
        console.error("Silinecek favori bulunamadı, ID:", id);
        throw new Error("Silinecek kayıt bulunamadı");
      }
      
      // String interpolation kullanarak doğrudan sorgu yapalım
      const result = await db.execAsync(
        `DELETE FROM user_favorites WHERE id = ${id}`
      );
      
      console.log("Favori silme sonucu:", result);
      return result;
    } catch (error) {
      console.error('Favori egzersiz silme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının sağlık verilerini ekle
  async insertHealthData(userEmail, healthData) {
    try {
      if (!userEmail) {
        console.error("insertHealthData: userEmail null veya undefined!");
        throw new Error("Email gerekli");
      }
      
      console.log("insertHealthData çağrıldı:", {
        userEmail,
        height: healthData.height,
        weight: healthData.weight
      });
      
      const db = await this.getDatabase();
      
      // String interpolation kullanarak sorgu oluştur
      const result = await db.execAsync(
        `INSERT INTO user_health_data (user_email, height, weight, exercise_duration, steps, entry_date) 
         VALUES ('${userEmail}', ${healthData.height}, ${healthData.weight}, 
                 ${healthData.exercise_duration}, ${healthData.steps}, 
                 '${new Date().toISOString()}')`,
      );
      
      console.log("Sağlık verisi ekleme sonucu:", result);
      return result;
    } catch (error) {
      console.error('Sağlık verisi ekleme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının sağlık verilerini getir
  async getHealthData(userEmail) {
    try {
      if (!userEmail) {
        console.error("getHealthData: userEmail null veya undefined!");
        return [];
      }
      
      console.log("getHealthData çağrıldı, email:", userEmail);
      const db = await this.getDatabase();
      
      const result = await db.getAllAsync(
        'SELECT * FROM user_health_data WHERE user_email = ? ORDER BY entry_date DESC',
        [userEmail]
      );
      
      console.log(`${result.length} adet sağlık verisi bulundu`);
      return result;
    } catch (error) {
      console.error('Sağlık verilerini getirme hatası:', error);
      throw error;
    }
  }

  // Tüm kullanıcıları çekme
  async getAllUsers() {
    try {
      const db = await this.getDatabase();
      
      const result = await db.getAllAsync('SELECT * FROM users');
      console.log(`${result.length} adet kullanıcı bulundu`);
      return result;
    } catch (error) {
      console.error('Tüm kullanıcıları getirme hatası:', error);
      throw error;
    }
  }

  // Email'e göre kullanıcı bilgilerini çekme
  async getUserByEmail(email) {
    try {
      if (!email) {
        console.error("getUserByEmail: email null veya undefined!");
        return null;
      }
      
      console.log("getUserByEmail çağrıldı, email:", email);
      const db = await this.getDatabase();
      
      const result = await db.getAllAsync(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Kullanıcı bilgisi getirme hatası:', error);
      throw error;
    }
  }
}

export default DatabaseHelper;