title=How to combine audio and video with ffmpeg
intro=When you downloaded them separately
tags=Linux
created=2020-05-10

Sometimes, download managers offer two options when downloading videos from a video-hosting websites: either you can download high-resolution video, or a video with audio.
But what if you want both: high-resolution video together with audio? Then you can combine them!

Imagine that files you downloaded are named `audio.mp4` and `video.mp4` (note that "audio" file does include video, too, but we're not interested it it).
Then you can just run a simple command like this:

	ffmpeg -i video.mp4 -i audio.mp4 -map 0:v -map 1:a -c copy -shortest output.mp4

Thanks to [this][a] stackoverflow answer for a detailed writeup!

[a]: https://stackoverflow.com/a/11783474
