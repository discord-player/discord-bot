import { Data } from "./parseData";

export function getEmoji(type: Data['type']) {
    switch(type) {
        case "classes":
            return "<:class:1276570862165688321>"
            
        case "functions":
            return "<:method:1276570862845296710>"

        case "properties":
            return "<:property:1276571017195814963>"

        case "types":
            return "<:typedef:1276571043120812144>️"
    }
}

export function getEmojiAutocompelte(type: Data['type']) {
    switch(type) {
        case "classes":
            return "📚"
            
        case "functions":
            return "🔧"

        case "properties":
            return "⭕"

        case "types":
            return "🗝️"
    }
}