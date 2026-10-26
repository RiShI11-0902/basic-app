// Lost and Found App (CRUD with Supabase)
// Save this file as:  app/index.tsx   (replace everything inside it)
// It needs the file:  lib/supabase.ts  (connection file in the project root)

import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/connection';

export default function LostFound() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Lost');
  const [editId, setEditId] = useState<number | null>(null);

  // READ: get all items from Supabase
  const loadItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: false });
    if (error) Alert.alert('Error', error.message);
    setItems(data || []);
  };

  // load the items when the app starts
  useEffect(() => {
    loadItems();
  }, []);

  // CREATE or UPDATE
  const saveItem = async () => {
    if (title === '') return;

    const row = { title, description, type, place, phone };

    if (editId === null) {
      // CREATE a new row
      const { error } = await supabase.from('items').insert(row);
      if (error) Alert.alert('Error', error.message);
    } else {
      // UPDATE the row being edited
      const { error } = await supabase.from('items').update(row).eq('id', editId);
      if (error) Alert.alert('Error', error.message);
    }

    // clear the form and refresh the list
    setTitle('');
    setDescription('');
    setPlace('');
    setPhone('');
    setType('Lost');
    setEditId(null);
    loadItems();
  };

  // EDIT: put the item's values back into the form
  const editItem = (item: any) => {
    setTitle(item.title);
    setDescription(item.description || '');
    setType(item.type);
    setPlace(item.place || '');
    setPhone(item.phone || '');
    setEditId(item.id);
  };

  // DELETE
  const deleteItem = async (id: number) => {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) Alert.alert('Error', error.message);
    loadItems();
  };

  return (
    <View style={{ flex: 1, marginTop: 60, padding: 15 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Lost and Found</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title="Lost" onPress={() => setType('Lost')} />
        <Button title="Found" onPress={() => setType('Found')} />
      </View>
      <Text style={{ textAlign: 'center', marginVertical: 6 }}>Selected: {type}</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}
      />
      <TextInput
        placeholder="Place"
        value={place}
        onChangeText={setPlace}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />

      <Button title={editId === null ? 'Add Item' : 'Update Item'} onPress={saveItem} />

      <FlatList
        style={{ marginTop: 15 }}
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>
              [{item.type}] {item.title}
            </Text>
            <Text>{item.description}</Text>
            <Text>Place: {item.place}</Text>
            <Text>Phone: {item.phone}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 6 }}>
              <Button title="Edit" onPress={() => editItem(item)} />
              <Button title="Delete" color="red" onPress={() => deleteItem(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}
