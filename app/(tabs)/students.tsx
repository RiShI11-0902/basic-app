
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/connection';

export default function Index() {
  const [students, setStudents] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [course, setCourse] = useState('');
  const [marks, setMarks] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // READ: get all students
  const loadStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: false });
    if (error) Alert.alert('Error', error.message);
    setStudents(data || []);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // CREATE or UPDATE
  const saveStudent = async () => {
    if (name === '' || rollNo === '') {
      Alert.alert('Enter name and roll number');
      return;
    }
    if (isNaN(parseFloat(marks))) {
      Alert.alert('Enter marks as a number');
      return;
    }

    const row = { name, roll_no: rollNo, course, marks: parseFloat(marks) };

    if (editId === null) {
      // CREATE
      const { error } = await supabase.from('students').insert(row);
      if (error) Alert.alert('Error', error.message);
    } else {
      // UPDATE
      const { error } = await supabase.from('students').update(row).eq('id', editId);
      if (error) Alert.alert('Error', error.message);
    }

    setName('');
    setRollNo('');
    setCourse('');
    setMarks('');
    setEditId(null);
    loadStudents();
  };

  // EDIT: put the student's values back into the form
  const editStudent = (s: any) => {
    setName(s.name);
    setRollNo(s.roll_no);
    setCourse(s.course || '');
    setMarks(String(s.marks));
    setEditId(s.id);
  };

  // DELETE
  const deleteStudent = async (id: number) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) Alert.alert('Error', error.message);
    loadStudents();
  };

  // SEARCH: show only the students whose name matches the search text
  const shown = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // SUMMARY: total students and average marks
  const average =
    students.length === 0
      ? 0
      : students.reduce((sum, s) => sum + Number(s.marks), 0) / students.length;

  return (
    <View style={{ flex: 1, marginTop: 60, padding: 15 }}>
      <Text style={{ fontSize: 24, marginBottom: 6 }}>Student Management</Text>
      <Text style={{ marginBottom: 10 }}>
        Total students: {students.length} | Average marks: {average.toFixed(1)}
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6, borderColor:"white", color:"white" }}
      />
      <TextInput
        placeholder="Roll number"
        value={rollNo}
        onChangeText={setRollNo}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6,  borderColor:"white", color:"white" }}
      />
      <TextInput
        placeholder="Course"
        value={course}
        onChangeText={setCourse}
        style={{ borderWidth: 1, padding: 8, marginBottom: 6, borderColor:"white", color:"white" }}
      />
      <TextInput
        placeholder="Marks"
        value={marks}
        onChangeText={setMarks}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8, borderColor:"white", color:"white" }}
      />

      <Button
        title={editId === null ? 'Add Student' : 'Update Student'}
        onPress={saveStudent}
      />

      <TextInput
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
        style={style.box}
      />

      <FlatList
        style={{ marginTop: 10 }}
        data={shown}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>Roll no: {item.roll_no}</Text>
            <Text>Course: {item.course}</Text>
            <Text>Marks: {item.marks}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 6 }}>
              <Button title="Edit" onPress={() => editStudent(item)} />
              <Button title="Delete" color="red" onPress={() => deleteStudent(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}


const style = StyleSheet.create({
  box:{
    color:"#f5f5f5",
    borderColor:"#f5f5f5"
  }
})
