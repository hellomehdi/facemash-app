export default function(pictures = [{}], action) {
	var picturesCopy = [];

	if (action.type == 'addPicture') {
		if (pictures !== undefined && pictures !== null) {
			picturesCopy = [...pictures];
		}
		picturesCopy.push(action.picture);
		return picturesCopy;
	} else if (action.type === 'setPictures') {
		picturesCopy = action.pictures;
		return picturesCopy;
	} else {
		return pictures;
	}
}
