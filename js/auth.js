import { api } from './api.js';

class Auth {
  constructor() {
    this.API_URL = 'http://localhost:5000'; // Remove /api
    this.token = localStorage.getItem('token');
  }

  async login(email, password) {
    const res = await fetch(`${this.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.token) throw new Error(data.error);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.user.role);
    return data;
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.user) {
        return data;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    return this.token;
  }
}

export default Auth;