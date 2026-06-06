import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const HelpSupportScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const faqs = [
    {
      question: "How do I send money?",
      answer: "To send money, go to the Send Money screen, enter the recipient's SwiftPay ID, email, or phone number, specify the amount, add an optional message, and confirm the transfer. The money will be transferred instantly."
    },
    {
      question: "Are there any transaction fees?",
      answer: "SwiftPay offers fee-free transactions for all users. There are no hidden charges or transaction fees when sending or receiving money through our platform."
    },
    {
      question: "How long does a transfer take?",
      answer: "Transfers are processed instantly. Once you confirm a transaction, the recipient will receive the money immediately and can use it right away."
    },
    {
      question: "Is my money safe?",
      answer: "Yes, your money is completely safe. We use bank-level encryption and security measures to protect your financial information and transactions. All data is securely stored and encrypted."
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, please contact our support team at support@swiftpay.com or call +1 (234) 567-8900. We'll help you regain access to your account securely."
    },
    {
      question: "What is a SwiftPay ID?",
      answer: "A SwiftPay ID is a unique 6-digit identifier (format: SP-XXXXXX) assigned to each user. You can share this ID with others to receive money, or they can use your email or phone number instead."
    },
    {
      question: "Can I send money to myself?",
      answer: "No, you cannot send money to yourself. The system prevents self-transfers to maintain transaction integrity."
    },
    {
      question: "What if I enter the wrong recipient?",
      answer: "Always double-check the recipient's information before confirming. If you've sent money to the wrong person, contact our support team immediately at support@swiftpay.com for assistance."
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMessage = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - in production, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Message Sent!',
        'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setMessage('');
              setErrors({});
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallSupport = () => {
    const phoneNumber = '+12345678900';
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Unable to make phone call');
      });
  };

  const handleEmailSupport = () => {
    const email = 'support@swiftpay.com';
    const subject = encodeURIComponent('SwiftPay Support Request');
    const body = encodeURIComponent(`Hello,\n\nI need assistance with:\n\n`);
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Email is not configured on this device');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Unable to open email client');
      });
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const openPrivacyPolicy = () => {
    // In production, this would open your privacy policy page
    Alert.alert(
      'Privacy Policy',
      'Our Privacy Policy outlines how we collect, use, and protect your personal information. For the full policy, please visit: https://swiftpay.com/privacy',
      [{ text: 'OK' }]
    );
  };

  const openTermsOfService = () => {
    // In production, this would open your terms of service page
    Alert.alert(
      'Terms of Service',
      'Our Terms of Service govern your use of SwiftPay. For the full terms, please visit: https://swiftpay.com/terms',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>We're here to help you</Text>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionHeaderText}>Customer Service</Text>
          <Text style={styles.sectionSubtext}>Get in touch with our support team</Text>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmailSupport}>
            <View style={styles.contactIconContainer}>
              <Icon name="email" size={24} color="#007AFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@swiftpay.com</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleCallSupport}>
            <View style={styles.contactIconContainer}>
              <Icon name="phone" size={24} color="#007AFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone Support</Text>
              <Text style={styles.contactValue}>+1 (234) 567-8900</Text>
              <Text style={styles.contactHours}>Mon-Fri: 9 AM - 6 PM EST</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <View style={styles.sectionHeader}>
            <Icon name="help-outline" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>

          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqContainer}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon
                  name={expandedFaq === index ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={24}
                  color="#007AFF"
                />
              </TouchableOpacity>
              {expandedFaq === index && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.contactForm}>
          <View style={styles.sectionHeader}>
            <Icon name="message" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Send us a Message</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={[
                styles.input,
                errors.name && styles.inputError
              ]}
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({...errors, name: ''});
              }}
              editable={!isSubmitting}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError
              ]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({...errors, email: ''});
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[
                styles.input,
                styles.messageInput,
                errors.message && styles.inputError
              ]}
              placeholder="How can we help you? (minimum 10 characters)"
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (errors.message) setErrors({...errors, message: ''});
              }}
              multiline
              numberOfLines={5}
              editable={!isSubmitting}
            />
            {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
            <Text style={styles.charCount}>{message.length} characters</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSubmitting || !name || !email || !message) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={isSubmitting || !name || !email || !message}
          >
            <Text style={styles.sendButtonText}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>Legal & Privacy</Text>
          <TouchableOpacity style={styles.legalLink} onPress={openPrivacyPolicy}>
            <Icon name="privacy-tip" size={20} color="#007AFF" />
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalLink} onPress={openTermsOfService}>
            <Icon name="description" size={20} color="#007AFF" />
            <Text style={styles.legalLinkText}>Terms of Service</Text>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SwiftPay © 2024</Text>
          <Text style={styles.footerSubtext}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  contactSection: {
    marginBottom: 30,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  contactHours: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  faqSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  faqContainer: {
    marginBottom: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactForm: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legalSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  legalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  legalLinkText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  footerSubtext: {
    color: '#999',
    fontSize: 12,
  },
});

export default HelpSupportScreen;
