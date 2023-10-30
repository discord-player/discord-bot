import Fuse from "fuse.js"

const names = ["Player", "GuildPlayerNode", "FFMPEG"]

const fuse = new Fuse(names, {
    includeScore: true
})

console.log(fuse.search("Play"))