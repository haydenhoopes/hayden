const musicApi = require("../api/music");
let artist = "Camilo Echeverry";

async function getMusic(artist) {
    try {
        let artistData = await musicApi.search(artist);
        let artists = artistData.data.results;
        let artistId;

        artists.forEach(a => {
            if (a.type == "artist" && a.title == artist) {
                artistId = a.id
            }
        });

        if (artistId == undefined) {
            console.error("Couldn't find an artist with that name.");
            return
        }

        let releasesData = await musicApi.getReleases(artistId);
        let releases = releasesData.data.releases;

        let bananaData = {
            'artist': artist,
            'releases': []
        }

        releases.forEach(async r => {
            if (r.status == "Accepted") {
                let newAlbum = {}
                newAlbum['title'] = r.title;
                newAlbum['tracks'] = [];
                let album = await musicApi.getRelease(r.id);
                let tracks = album.data.tracklist;
                tracks.forEach(t => {
                    console.log(t.title)
                })
            }
        })
    } catch (error) {
        console.error(error);
    }
}

getMusic(artist)
