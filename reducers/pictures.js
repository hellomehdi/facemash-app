export default function(pictures = [{}], action) {
	var picturesCopy = [];

	if (action.type == 'addPicture') {
		console.log('RX PICTURES BEFORE = ' + pictures);
		console.log('RX PICTURE TO ADD = ' + JSON.stringify(action.picture));
		if (pictures !== undefined && pictures !== null) {
			picturesCopy = [...pictures];
		}
		picturesCopy.push(action.picture);
		console.log('RX REDUCER DONE');
		console.log('RX PICTURES AFTER = ' + picturesCopy);
		return picturesCopy;
	} else if (action.type === 'setPictures') {
		// picturesCopy = [action.pictures];
		picturesCopy = action.pictures;
		return picturesCopy;
	} else {
		return pictures;
	}
}

//====
// export default function(wishlist=[], action) {
//     var wishlistCopy = [];
//     if(action.type === 'addArticle' && wishlistCopy.some(article => article.title === action.articleLiked.title) === false) {
//         wishlistCopy = [...wishlist];
//         wishlistCopy.push(action.articleLiked);
//         return wishlistCopy;
//     } else if(action.type === 'removeArticle') {
//         wishlistCopy = [...wishlist];
//         wishlistCopy = wishlistCopy.filter(article => article.title !== action.articleRemoved.title);
//         return wishlistCopy;
//     } else if(action.type === 'setArticles'){
//         wishlistCopy = action.articlesAdded;
//         return wishlistCopy;
//     } else if(action.type === 'resetArticles'){
//         wishlistCopy = [];
//         return wishlistCopy;
//     } else {
//         return wishlist;
//     }
// }
//====
