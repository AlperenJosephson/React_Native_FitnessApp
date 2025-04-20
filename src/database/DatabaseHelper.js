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
      
      
      await db.execAsync(
        `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`
      );
      
      // En son eklenen kullanıcının ID'sini almak için ayrı bir sorgu çalıştır
      const result = await db.getAllAsync(
        `SELECT last_insert_rowid() as id`
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
      const db = await this.getDatabase();
      
      await db.execAsync(
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
    } catch (error) {
      console.error('Favori egzersiz ekleme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının favori egzersizlerini çekme
  async getUserFavorites(userEmail) {
    try {
      const db = await this.getDatabase();
      
      return await db.getAllAsync(
        'SELECT * FROM user_favorites WHERE user_email = ?',
        [userEmail]
      );
    } catch (error) {
      console.error('Favori egzersizleri getirme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının favori egzersizini silme
  async deleteFavoriteExercise(id) {
    try {
      const db = await this.getDatabase();
      
      await db.execAsync(
        'DELETE FROM user_favorites WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Favori egzersiz silme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının sağlık verilerini ekle
  async insertHealthData(userEmail, healthData) {
    try {
      const db = await this.getDatabase();
      
      await db.execAsync(
        'INSERT INTO user_health_data (user_email, height, weight, exercise_duration, steps, entry_date) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userEmail,
          healthData.height,
          healthData.weight,
          healthData.exercise_duration,
          healthData.steps,
          new Date().toISOString()
        ]
      );
    } catch (error) {
      console.error('Sağlık verisi ekleme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının sağlık verilerini getir
  async getHealthData(userEmail) {
    try {
      const db = await this.getDatabase();
      
      return await db.getAllAsync(
        'SELECT * FROM user_health_data WHERE user_email = ? ORDER BY entry_date DESC',
        [userEmail]
      );
    } catch (error) {
      console.error('Sağlık verilerini getirme hatası:', error);
      throw error;
    }
  }
}

export default DatabaseHelper;