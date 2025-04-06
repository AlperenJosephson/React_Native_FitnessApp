// Basit bir kullanıcı oturumu yönetim sınıfı
class UserSession {
  constructor() {
    this.user = null;
  }

  // Kullanıcı bilgilerini ayarla
  setUser({ email, username }) {
    this.user = {
      email,
      username,
      isLoggedIn: true
    };
    return this.user;
  }

  // Kullanıcı bilgilerini getir
  getUser() {
    return this.user;
  }

  // Kullanıcının giriş yapıp yapmadığını kontrol et
  isLoggedIn() {
    return this.user !== null && this.user.isLoggedIn === true;
  }

  // Kullanıcı çıkışı
  logout() {
    this.user = null;
  }
}

// Singleton örneği oluştur
export const userSession = new UserSession();