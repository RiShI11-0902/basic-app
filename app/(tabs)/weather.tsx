
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>();
  const [message, setMessage] = useState('');

  const getWeather = async () => {
    if (city === '') {
      setMessage('Please enter a city');
      return;
    }

    try {
      setMessage('Loading...');
      setWeather(null);

      // Step 1: find the latitude and longitude of the city
      const geoResponse = await fetch(
        'https://geocoding-api.open-meteo.com/v1/search?name=' + city + '&count=1'
      );
      const geoData = await geoResponse.json();

      if (!geoData.results) {
        setMessage('City not found');
        return;
      }

      const place = geoData.results[0];

      // Step 2: get the current weather for that location
      const weatherResponse = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=' + place.latitude +
        '&longitude=' + place.longitude + '&current_weather=true'
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        name: place.name,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
      });
      setMessage('');
    } catch (error) {
      setMessage('Network error, try again');
    }
  };

  return (
    <View style={{ marginTop: 60, padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>Weather App</Text>

      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Get Weather" onPress={getWeather} />

      <Text style={{ marginTop: 15 }}>{message}</Text>

      {weather && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 24 }}>{weather.name}</Text>
          <Text style={{ fontSize: 18 }}>Temperature: {weather.temperature} °C</Text>
          <Text style={{ fontSize: 18 }}>Wind speed: {weather.windspeed} km/h</Text>
        </View>
      )}
    </View>
  );
}
