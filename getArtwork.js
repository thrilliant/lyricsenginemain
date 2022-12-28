const axios = require( 'axios' );

var getAlbumArt = function ( song,callback ) {
    axios.get( `https://itunesartwork.bendodson.com/api.php?query=${song}&entity=song&country=us&type=request` )
        .then( ( res ) => {
            return axios.get( res.data.url );
        } )
        .then( ( res ) => {
            var imageUrl = ( res.data.results[ 0 ].artworkUrl60.replace( /60x60/,"600x600" ) );
            callback (imageUrl);
            
        } )
        .catch( ( err ) => {
            var imageUrl = "No Image Found"
            callback (imageUrl);
        } );
}

module.exports = getAlbumArt;