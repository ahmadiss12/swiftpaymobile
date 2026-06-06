import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'swiftpay_auth_token';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: state.user ? { ...state.user, balance: action.payload } : state.user,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) {
          if (mounted) {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
          return;
        }

        apiService.setToken(token);
        const data = await apiService.getDashboard();
        if (mounted && data?.user) {
          dispatch({ type: 'SET_USER', payload: data.user });
        }
      } catch {
        await AsyncStorage.removeItem(TOKEN_KEY);
        apiService.clearToken();
        if (mounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await apiService.login(credentials);
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    apiService.setToken(data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data;
  };

  const register = async (userData) => {
    const data = await apiService.register(userData);
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    apiService.setToken(data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data;
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
      apiService.clearToken();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateBalance = (newBalance) => {
    dispatch({ type: 'UPDATE_BALANCE', payload: Number(newBalance) });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
