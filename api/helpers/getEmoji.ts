import { Data } from "./client";

export function getEmoji(type: Data['type']) {
    switch(type) {
        case "classes":
            return "<:class:1169554063025766410>"
            
        case "functions":
            return "<:method:1169554066750312529>"

        case "properties":
            return "<:property:1169554069208170605>"

        case "types":
            return "<:typedef:1169553846150897694>"
    }
}