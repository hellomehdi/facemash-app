import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	ImageBackground,
	Text,
	View,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';

import { Button, Overlay } from 'react-native-elements';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';

import { Camera } from 'expo-camera';

function SnapScreen(props) {
	const [hasPermission, setHasPermission] = useState(null);

	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

	const [visible, setVisible] = useState(false);

	const IPDADDRESS = '172.16.9.200:3000';
	// const IPDADDRESS = '192.168.0.100:3000';

	var camera = useRef(null);

	// FUNCTION TAKE PICTURE
	const takePicture = async () => {
		// Déclenche la prise de photo au clic sur le bouton.
		if (camera) {
			setVisible(true);
			let photo = await camera.takePictureAsync({
				quality: 0.7,
				base64: true,
				exif: true
			});

			// Envoi au backend
			var data = new FormData();

			data.append('picture', {
				uri: photo.uri,
				type: 'image/jpeg',
				name: 'user_picture.jpg'
			});
			var rawResponse = await fetch(`http://${IPDADDRESS}/upload`, {
				method: 'post',
				body: data
			});
			var response = await rawResponse.json();

			if (response.result === true) {
				setVisible(false);
				console.log('RESPONSE BELOW');
				console.log(response.data);
				props.storePicture(response.data);
				console.log('BEFORE COPY');
				console.log('props.pictures = ' + [props.pictures]);
				console.log('BEFORE PUSH');
				var picturesListCopy;
				if (props.pictures === null) {
					picturesListCopy = response.data;
				} else {
					picturesListCopy = props.pictures;
					picturesListCopy.push(response.data);
				}
				console.log('AFTER PUSH');
				AsyncStorage.setItem(
					'storagePictures',
					JSON.stringify(picturesListCopy)
				);
				return Toast.show('Image uploaded !', Toast.LONG);
			} else {
				setVisible(false);
				return Toast.show('Image failed to upload.', Toast.LONG);
			}
		}
	};

	// ASK FOR PERMISSION
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	// DISPLAY CAM IF CONDITIONS TRUE
	var cameraDisplay;
	if (hasPermission && props.isFocused) {
		cameraDisplay = (
			<Camera
				style={{ flex: 1 }}
				type={type}
				flashMode={flash}
				ratio='16:9'
				ref={(ref) => (camera = ref)}
			></Camera>
		);
	} else {
		cameraDisplay = <View style={{ flex: 1 }}></View>;
	}

	// CAMERA ACTION BUTTONS
	var reverseButton = (
		<TouchableOpacity
			style={styles.reverseButton}
			onPress={() => {
				setType(
					type == Camera.Constants.Type.back
						? Camera.Constants.Type.front
						: Camera.Constants.Type.back
				);
			}}
		>
			<Ionicons
				name='md-reverse-camera'
				size={25}
				color={type === Camera.Constants.Type.back ? '#fff' : '#eb4d4b'}
			/>
		</TouchableOpacity>
	);

	var flashButton = (
		<TouchableOpacity
			style={styles.flashButton}
			onPress={() => {
				setFlash(
					flash == Camera.Constants.FlashMode.off
						? Camera.Constants.FlashMode.torch
						: Camera.Constants.FlashMode.off
				);
			}}
		>
			<Ionicons
				name='ios-flash'
				size={25}
				color={flash === Camera.Constants.FlashMode.off ? '#fff' : '#eb4d4b'}
			/>
		</TouchableOpacity>
	);

	var shootButton = (
		<TouchableOpacity style={styles.shootButton} onPress={() => takePicture()}>
			<MaterialCommunityIcons name='camera-iris' size={25} color='#fff' />
		</TouchableOpacity>
	);

	// RETURN PRINCIPAL
	return (
		<View style={{ flex: 1 }}>
			<Overlay isVisible={visible} width='auto' height='auto'>
				<Text>Loading</Text>
			</Overlay>
			<View style={{ backgroundColor: '#130f40' }}>
				<Text style={styles.topTitle}>Snap a picture</Text>
			</View>
			{cameraDisplay}
			{reverseButton}
			{flashButton}
			{shootButton}
		</View>
	);
}

// STYLES
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	shootButton: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		width: 70,
		position: 'absolute',
		bottom: 10,
		right: 10,
		height: 70,
		backgroundColor: '#130f40',
		borderRadius: 100
	},
	reverseButton: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		width: 70,
		position: 'absolute',
		bottom: 90,
		right: 10,
		height: 70,
		backgroundColor: '#130f40',
		borderRadius: 100
	},
	flashButton: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		width: 70,
		position: 'absolute',
		bottom: 170,
		right: 10,
		height: 70,
		backgroundColor: '#130f40',
		borderRadius: 100
	},
	topTitle: {
		alignSelf: 'center',
		marginBottom: 15,
		marginTop: 35,
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFF'
	}
});

// REDUX STATES
function mapStateToProps(state) {
	return { pictures: state.pictures };
}

// REDUX DISPATCH
function mapDispatchToProps(dispatch) {
	return {
		storePicture: function(picture) {
			dispatch({
				type: 'addPicture',
				picture: picture
			});
		}
	};
}

// EXPORT
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withNavigationFocus(SnapScreen));
// export default withNavigationFocus(SnapScreen);
