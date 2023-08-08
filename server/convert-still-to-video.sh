ffmpeg -framerate 1/10 -i image.png -c:v libx264 -t 10 -pix_fmt yuv420p -vf scale=320:240 out.mp4
