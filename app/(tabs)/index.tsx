import { Image, StyleSheet, View, Text } from 'react-native';
import { MediaPicker } from '@/components/MediaPicker';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MediaPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
