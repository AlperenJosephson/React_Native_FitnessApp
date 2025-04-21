// src/screens/UserSession.js
class UserSession {
  constructor() {
    this.user = null;
  }

  // Kullanıcı bilgilerini ayarla
  setUser({ email, username }) {
    console.log("UserSession: Kullanıcı ayarlanıyor:", email, username);
    this.user = {
      email,
      username,
      isLoggedIn: true
    };
    return this.user;
  }

  // Kullanıcı bilgilerini getir
  getUser() {
    console.log("UserSession: getUser çağrıldı, mevcut kullanıcı:", this.user);
    return this.user;
  }

  // Kullanıcının giriş yapıp yapmadığını kontrol et
  isLoggedIn() {
    return this.user !== null && this.user.isLoggedIn === true;
  }

  // Kullanıcı çıkışı
  logout() {
    console.log("UserSession: Kullanıcı çıkış yapıyor");
    this.user = null;
  }
}

// Singleton örneği oluştur
export const userSession = new UserSession();