import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import {useState} from 'react';
import styles from './style';

const register = async (data) => {
  const response = await fetch('http://127.0.0.1:8000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: data.fullName,
      email: data.email,
      phone: data.phoneNumber,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
                 
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.log('Register error response:', responseData); 
    const msg =
      responseData.message ||
      (responseData.errors && Object.values(responseData.errors)[0][0]) ||
      'Registration failed';
    throw new Error(msg);
  }

  return responseData;
};




const SignUpScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateInputs = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
        if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required.';
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid Email is required.';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSignUp = async () => {
        if (!validateInputs()) return;
        setIsLoading(true);
        try {
            const result = await register({
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                passwordConfirmation: confirmPassword,
            });
            console.log('Registration successful:', result);
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'An error occurred during registration.');
        }
        setIsLoading(false);
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>   
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started with SwiftPay</Text>
                <View style={styles.inputContainer}>    
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput 
                        style={[styles.input, errors.fullName && styles.inputError]}
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        editable={!isLoading}
                    />
                    {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                </View>
                <View style={styles.inputContainer}>    
                    <Text style={styles.label}>Phone Number</Text>  
                    <TextInput 
                        style={[styles.input, errors.phoneNumber && styles.inputError]}
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!isLoading}
                    />
                    {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                </View>
                <View style={styles.inputContainer}>    
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="Enter your email address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        editable={!isLoading}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>
                <View style={styles.inputContainer}>    
                    <Text style={styles.label}>Password</Text>
                    <TextInput 
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />  
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput 
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />  
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>
                <TouchableOpacity   
                    style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                    onPress={handleSignUp}
                    disabled={isLoading}
                >
                    <Text style={styles.signupButtonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUpScreen;

