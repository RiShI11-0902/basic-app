import { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/connection';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // when the app starts: check for a saved login, and listen for login / logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event : any, s: any) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // SIGNUP
  const signUp = async () => {
    if (email === '' || password === '') {
      Alert.alert('Enter email and password');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) Alert.alert('Signup failed', error.message);
  };

  // LOGIN
  const signIn = async () => {
    if (email === '' || password === '') {
      Alert.alert('Enter email and password');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login failed', error.message);
  };

  // LOGOUT
  const signOut = async () => {
    await supabase.auth.signOut();
    setPassword('');
  };

  // if the user is logged in, show the welcome screen
  if (session) {
    return (
      <View style={{ marginTop: 100, padding: 20 }}>
        <Text style={{ fontSize: 26, marginBottom: 10 }}>Welcome!</Text>
        <Text style={{ marginBottom: 20 }}>Logged in as {session.user.email}</Text>
        <Button title="Logout" onPress={signOut} />
      </View>
    );
  }

  // otherwise show the login / signup form
  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 15 }}>Login / Signup</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password (minimum 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title={loading ? 'Please wait...' : 'Login'} onPress={signIn} disabled={loading} />
      <View style={{ height: 10 }} />
      <Button title="Create account" onPress={signUp} disabled={loading} />
    </View>
  );
}
