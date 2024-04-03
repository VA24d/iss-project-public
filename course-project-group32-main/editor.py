from fileinput import filename
import os
import sys
import webcolors as wbc
import tempfile

from sklearn.metrics import top_k_accuracy_score

# from isort import file

try:
    import io

    from pydub import AudioSegment
    import moviepy as mp
    import moviepy.editor as mpe
    from moviepy.editor import transfx
    import matplotlib.pyplot as plt
    import numpy as np

    # import librosa.display
    from moviepy.editor import (
        VideoClip,
        CompositeVideoClip,
        concatenate_videoclips,
        ColorClip,
    )
    from moviepy.video.fx import all as vfx
    from PIL import Image
except ImportError:
    print(
        "Please install the required packages using the following command: pip install moviepy matplotlib numpy librosa"
    )
    exit(1)


# config.change_settings({"FFMPEG_BINARY": "ffmpeg"})
# Redirect stderr to /dev/null or NUL
# if hasattr(sys, 'stderr'):
#     sys.stderr = open(os.devnull, 'w')


def init_blank_order():
    order = dict()
    order["audio"] = dict()
    order["video"] = dict()
    return order


def init_default_order():
    order = init_blank_order()
    order["audio"]["1"] = {
        "name": "",
        "file_path": "",
        "format": "mp3",
        "waveform": "waveform.png",
        "length": "00:00:00",
        "start": "00:00:00",
    }
    order["video"]["1"] = {
        "type": "img",  # can be img, vid, transition
        "name": "",
        "file_path": "",  # mysql
        "thumbnail": "thumbnail.png",
        "length": "00:00:00",
        "start": "00:00:00",
        "transitions_end": True,
        "transition": "fade",
    }

    order["video"]["2"] = {
        "type": "transition",  # can be img, vid, transition
        "transition": "fade",
        "duration": "00:00:01",
        "args": {"fadein": 1, "fadeout": 1},
    }

    return order


def create_audio_data(audio_path):
    try:
        audio = AudioSegment.from_file(audio_path)
        duration = len(audio) / 1000  # Convert milliseconds to seconds
        file_name = audio_path.split("/")[-1]
        file_name = file_name.split(".")[0]
        file_type = file_name.split(".")[-1].upper()

        # y, sr = librosa.load(audio_path, sr=None)

        # # Increase the figure width to make the waveform longer
        # plt.figure(figsize=(20, 5))

        # # Plot the waveform
        # librosa.display.waveshow(y, sr=sr)

        # # Remove axes and captions
        # plt.axis('off')

        # # Save the waveform image to a BytesIO object
        # buffer = io.BytesIO()
        # plt.savefig(buffer, format="png", dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)
        # plt.close()

        # # Get binary data from the BytesIO object
        # buffer.seek(0)
        # print(buffer)
        # binary_img_data = buffer.getvalue()

        # encoded_waveform = binary_img_data.encode('base64').replace('\n', '')

        return file_name, file_type, duration  # , encoded_waveform
    except Exception as e:
        print("Error:", e)
        return None, None, None


def create_audio_waveform(audio_path):
    try:
        # Load audio file
        y, sr = librosa.load(audio_path, sr=None)

        # Increase the figure width to make the waveform longer
        plt.figure(figsize=(20, 5))

        # Plot the waveform
        librosa.display.waveshow(y, sr=sr)

        # Remove axes and captions
        plt.axis("off")

        # Save the waveform as a PNG image in memory
        buffer = io.BytesIO()
        plt.savefig(
            buffer,
            format="png",
            dpi=300,
            bbox_inches="tight",
            pad_inches=0,
            transparent=True,
        )
        plt.close()

        # Get binary data from the BytesIO buffer
        buffer.seek(0)
        binary_data = buffer.getvalue()

        return binary_data
    except Exception as e:
        print("Error:", e)
        return None


def create_thumbnail(video_path, output_path, time=0.5):
    # Load the video
    video = mpe.VideoFileClip(video_path)

    # Capture a frame at the specified time
    frame = video.save_frame(output_path, t=time)

    # Close the video
    video.close()


def create_audio_waveform_from_video(video_path, output_path):
    # Load the video
    video = mpe.VideoFileClip(video_path)

    # Extract the audio from the video
    audio = video.audio

    # Save the audio as a WAV file
    audio.write_audiofile("temp.wav")

    # Close the video
    video.close()

    # Create the waveform from the extracted audio
    create_audio_waveform("temp.wav", output_path)

    # Delete the temporary audio file
    os.remove("temp.wav")


def transition(clip1, clip2, transition_type, duration=0.5, color="white", **kwargs):
    transition_type = transition_type.lower()
    if transition_type[:4] == "fade":
        return CompositeVideoClip(
            [
                clip1,
                clip2.set_start(clip1.duration - duration)
                .crossfadein(duration)
                .set_duration(clip2.duration),
            ],
            size=(max(clip1.size[0], clip2.size[0]), max(clip1.size[1], clip2.size[1])),
        )
    elif transition_type[:5] == "slide":
        direction = transition_type.split("--")[1]
        if direction == "up":
            direction = "top"
        elif direction == "down":
            direction = "bottom"
        return CompositeVideoClip(
            [
                clip1,
                clip2.set_start(clip1.duration - duration)
                .fx(transfx.slide_in, duration=duration, side=direction)
                .set_duration(clip2.duration),
            ],
            size=clip1.size,
        )
    elif transition_type[:4] == "zoom":
        return CompositeVideoClip(
            [
                clip1,
                clip2.set_start(clip1.duration - duration)
                .crossfadein(duration)
                .set_duration(clip2.duration),
            ],
            size=(max(clip1.size[0], clip2.size[0]), max(clip1.size[1], clip2.size[1])),
        )
    elif transition_type[:5] == "color":
        # Color transition
        return color_transition(
            clip1, clip2, duration, color=transition_type.split("--")[1]
        )
    else:
        # Default to crossfade if transition type is not recognized
        return CompositeVideoClip(
            [
                clip1,
                clip2.set_start(clip1.duration - duration)
                .crossfadein(duration)
                .set_duration(clip2.duration),
            ],
            size=(max(clip1.size[0], clip2.size[0]), max(clip1.size[1], clip2.size[1])),
        )


def color_transition(clip1, clip2, duration, color="white"):
    # Get the size of clip1
    width, height = clip1.size

    # Create a function to generate a frame with the specified color

    try:
        color = wbc.name_to_rgb(color)
    except:
        color = "white"
        color = wbc.name_to_rgb(color)
    color = (color.red, color.green, color.blue)

    def make_frame(t):
        return np.full((height, width, 3), fill_value=color, dtype=np.uint8)

    # Create an ImageClip from the generated frame
    color_clip = mpe.VideoClip(make_frame, duration=duration)

    # Concatenate the clips together with the color clip in between
    final_clip = concatenate_videoclips(
        [clip1, color_clip, clip2.set_start(duration)], method="compose"
    )

    return final_clip


def get_clip_from_id(img_id, db_con, duration=5, th=720, tw=1280):
    cursor = db_con.cursor()
    cursor.execute("select image_data from user_images where image_id = %s", (img_id,))
    # img_64 = cursor.fetchone()[0]
    img_b = (cursor.fetchone()[0]).tobytes()
    img = Image.open(io.BytesIO(img_b))
    print(img.size)

    current_width, current_height = img.size

    # Define the target size
    target_width = tw
    target_height = th

    # Calculate the scaling factor to maintain aspect ratio
    width_ratio = target_width / current_width
    height_ratio = target_height / current_height
    scaling_factor = min(width_ratio, height_ratio)

    # Calculate the new size based on the scaling factor
    new_width = int(current_width * scaling_factor)
    new_height = int(current_height * scaling_factor)

    # Resize the image
    resized_image = img.resize((new_width, new_height), Image.LANCZOS)

    # Create a blank background of the target size
    background = Image.new("RGB", (target_width, target_height), (0, 0, 0))

    # Calculate the position to paste the resized image at the center of the background
    paste_position = (
        (target_width - new_width) // 2,
        (target_height - new_height) // 2,
    )

    # Paste the resized image onto the background
    background.paste(resized_image, paste_position)
    print(img.size)
    np_im = np.asarray(background)
    print(np.shape(np_im))
    mp_im = mpe.ImageClip(np_im).set_duration(duration)
    return mp_im


def get_audio_from_name(audio_name, dbcon, ls):
    cursor = dbcon.cursor()

    if ls==0:
        cursor.execute("select audio_data from audiotracks where audio_name = %s", (audio_name,))
    else:
        cursor.execute("select audio_data from soundtracks where audio_name = %s", (audio_name,))

    audio_blob = (cursor.fetchone()[0]).tobytes()

    audio_data = io.BytesIO(audio_blob)

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio_file:
        temp_audio_file.write(audio_data.getvalue())
        temp_audio_file_path = temp_audio_file.name

    print(temp_audio_file_path)

    audio_clip = mpe.AudioFileClip(temp_audio_file_path)

    cursor.close()

    os.remove(temp_audio_file_path)

    return audio_clip

def conc_aud(aud_list):
    return mpe.concatenate_audioclips(aud_list)

if __name__ == "__main__":
    # create_audio_waveform("1-01 This Feeling.mp3", "This_feel.png")
    # clip1 = VideoFileClip("clip1.mp4")
    # clip2 = VideoFileClip("clip2.mp4")
    # transitioned_clip = transition(clip1, clip2, transition_type='wipe', duration=2, direction='left')
    # print(create_audio_data("1-01 This Feeling.mp3"))
    pass
    # print(create_audio_data("1-01 This Feeling.mp3"))
