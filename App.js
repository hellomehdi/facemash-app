// console.disableYellowBox = true; // disable warnings

import React from 'react';

// SCREENS
import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import SnapScreen from './screens/SnapScreen';

// IMPORTS NAVIGATIONS
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// ICONS
import { Ionicons } from '@expo/vector-icons';

// REDUX
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import pseudo from './reducers/pseudo';
import pictures from './reducers/pictures';

const store = createStore(combineReducers({ pseudo, pictures }));

// BOTTOM NAVIGATION
var BottomNavigator = createBottomTabNavigator(
	{
		Gallery: GalleryScreen,
		Snap: SnapScreen
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ tintColor }) => {
				var iconName;
				if (navigation.state.routeName == 'Gallery') {
					iconName = 'ios-photos';
				} else if (navigation.state.routeName == 'Snap') {
					iconName = 'ios-camera';
				}

				return <Ionicons name={iconName} size={25} color={tintColor} />;
			}
		}),
		tabBarOptions: {
			activeTintColor: '#eb4d4b',
			inactiveTintColor: '#FFFFFF',
			style: {
				backgroundColor: '#130f40'
			}
		}
	}
);

// STACK NAVIGATION
StackNavigator = createStackNavigator(
	{
		Home: HomeScreen,
		BottomNavigator: BottomNavigator
	},
	{ headerMode: 'none' }
);

const Navigation = createAppContainer(StackNavigator);

// EXPORT PRINCIPAL
export default function App() {
	return (
		<Provider store={store}>
			<Navigation />
		</Provider>
	);
}
