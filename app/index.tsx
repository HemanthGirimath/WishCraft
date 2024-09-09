import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const bulletPoints = [
    "Make wishes and see them come true, but be careful!",
    "Our AI genie is clever and mischievous",
    "Poorly structured wishes may result in unexpected outcomes",
    "The AI looks for loopholes in your wish phrasing",
    "You might get what you asked for, but not what you wanted",
    "Challenge yourself to craft precise, well-thought-out wishes",
    "Learn the art of careful wording and clear intentions",
    "Enjoy the surprise and humor in each wish interpretation"
  ];

  const renderBulletPoint = ({ item }: { item: string }) => (
    <View style={styles.bulletPointContainer}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletPointText}>{item}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Welcome to WishCraft</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/wish')}
        >
          <Text style={styles.buttonText}>Make a Wish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionTitle}>Guide to WishCraft</Text>
        <FlatList
          data={bulletPoints}
          renderItem={renderBulletPoint}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Add more sections here if needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionSection: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bulletPointContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 16,
    marginRight: 5,
  },
  bulletPointText: {
    fontSize: 16,
    flex: 1,
  },
});