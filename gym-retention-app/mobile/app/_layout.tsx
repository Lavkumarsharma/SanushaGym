import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider } from '@/services/socket';
import LoginScreen from './(auth)/login';
import MemberHomeScreen from './(member)/index';
import CheckInScreen from './(member)/check-in';
import HistoryScreen from './(member)/history';
import AddOnsScreen from './(member)/add-ons';
import RenewalScreen from './(member)/renewal';
import SettingsScreen from './(member)/settings';

const Stack = createStackNavigator();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SocketProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="auth-login" component={LoginScreen} options={{ gestureEnabled: true }} />
            </Stack.Group>

            <Stack.Group>
              <Stack.Screen name="member-home" component={MemberHomeScreen} />
              <Stack.Screen name="member-check-in" component={CheckInScreen} />
              <Stack.Screen name="member-history" component={HistoryScreen} />
              <Stack.Screen name="member-addons" component={AddOnsScreen} />
              <Stack.Screen name="member-renewal" component={RenewalScreen} />
              <Stack.Screen name="member-settings" component={SettingsScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </SocketProvider>
      </SafeAreaProvider>
  );
}
