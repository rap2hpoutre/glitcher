## Work in progress

Notes en vrac

Temps d'une wav

```
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav
```

Division du temps en 4

```
echo $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)/4))
```

Découpage de la wav en 4 morceaux

```
ffmpeg -i dl.wav -ss 0:00:00 -t $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)/4)) -y dl1.wav
ffmpeg -i dl.wav -ss $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)/4)) -t $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)/4)) -y dl2.wav
ffmpeg -i dl.wav -ss $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)*2/4)) -t $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)/4)) -y dl3.wav
ffmpeg -i dl.wav -ss $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)*3/4)) -t $(($(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 dl.wav)/4)) -y dl4.wav
```

Concaténer les 4 morceaux

```
ffmpeg -y -i dl1.wav -i dl3-process.wav -i dl1.wav -i dl2.wav -filter_complex '[0:0][1:0][2:0][3:0]concat=n=4:v=0:a=1[out]' -map '[out]' dl_concat.wav
```

Les effets:

```
ffmpeg -i dl3.wav -filter_complex "areverse" dl3-process.wav
```
