title=How to merge subtitles
uuid=6d95cb59-101d-46e5-88a3-3e29c81ad01b
intro=for example, to see them both in original and in your native language
tags=ffmpeg links
style=
styles=
created=2024-07-03
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Usually video players allow you to chose a subtitle track to show, but only one.
But what if you want to see _two_ subtitle tracks at the same time?
For example, when you're learning a foreign language,
and want to see text both in original and your native languages at the same time.

Easy!

1. Run `ffprobe Movie.mkv` to see what subtitles are available in the movie file.

2. Find out their indexes - they're 0-based, and **not** the stream number that `ffprobe` shows you

3. For each of subtitle tracks you want to extract, run the following command:

		ffmpeg -i Movie.mkv -map 0:s:5 file.srt

   where `5` is index of the stream, `file.srt` is the output file with subtitles, and `Movie.mkv` is, you guessed, the video file.
   More info about this command available [on stackoverflow][x]

4. After that, use this tool to merge files together: <https://subtitletools.com/merge-subtitles-online>


[x]: https://superuser.com/questions/583393/how-to-extract-subtitle-from-video-using-ffmpeg
