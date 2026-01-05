import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from './style';
const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>SwiftPay</Text>   
                <Text style={styles.tagline}>Fast. Secure. Everywhere.</Text>
                <View style={styles.features}>
                    <Text style={styles.featureText}>Send Money</Text>
                    <Text style={styles.featureText}>Pay Bills</Text>
                    <Text style={styles.featureText}>Mobile Recharge</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.signupButton}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
export default WelcomeScreen;