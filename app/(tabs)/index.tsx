// Simple Calculator App
// Use: copy this code into App.js (or rename this file to App.js)

import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function App() {
  // state to store the two numbers and the result
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState<number | string>(0);

  // this function runs when a button is pressed
  const calculate = (operation : any) => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    // check that both boxes have numbers
    if (isNaN(a) || isNaN(b)) {
      setResult('Enter both numbers');
      return;
    }

    if (operation === '+') setResult(a + b);
    if (operation === '-') setResult(a - b);
    if (operation === '*') setResult(a * b);
    if (operation === '/') {
      if (b === 0) setResult('Cannot divide by 0');
      else setResult(a / b);
    }
  };

  return (
    <View style={{ marginTop: 60, padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>Calculator</Text>

      {/* keyboardType="numeric" opens the phone's number keypad */}
      <TextInput
        placeholder="First number"
        value={num1}
        onChangeText={setNum1}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Second number"
        value={num2}
        onChangeText={setNum2}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <Button title="+" onPress={() => calculate('+')} />
        <Button title="-" onPress={() => calculate('-')} />
        <Button title="x" onPress={() => calculate('*')} />
        <Button title="/" onPress={() => calculate('/')} />
      </View>

      <Text style={{ fontSize: 24, textAlign: 'center', marginTop: 10 }}>
        Result: {String(result)}
      </Text>
    </View>
  );
}
