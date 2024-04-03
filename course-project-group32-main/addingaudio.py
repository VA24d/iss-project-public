#adding audio to video
from moviepy.editor import AudioFileClip,VideoFileClip,CompositeAudioClip

input_video_clip=VideoFileClip("video.mp4") #name of video
input_audio_clip=AudioFileClip("audio.mp3") #name of audio

duration=input_video_clip.duration
temp_audio_clip=input_audio_clip.set_duration(duration)
final_audio_clip=CompositeAudioClip([temp_audio_clip])

final=input_video_clip.set_audio(final_audio_clip)
final.write_videofile("output.mp4",fps=60) #name of output