import type { Documentation } from "typedoc-nextra"
import { Data } from "../helpers/client"

declare global {
    var docsRawData: Documentation
    var docsParsedData: Map<"extractor"|"equalizer"|"discord-player"|"ffmpeg"|"opus"|"utils"|"downloader", Data[]>
}