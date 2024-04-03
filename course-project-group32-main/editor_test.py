import editor
import moviepy.editor as mpe
from moviepy.editor import transfx
from PIL import Image
import numpy as np

def get_clip_from_path(img_path, duration=5):
    img = Image.open(img_path)
    print(img.size)

    current_width, current_height = img.size

    # Define the target size
    target_width = 1280
    target_height = 720

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
    background = Image.new('RGB', (target_width, target_height), (0, 0, 0))

    # Calculate the position to pastransitionIds.forEach(id => {
    paste_position = ((target_width - new_width) // 2, (target_height - new_height) // 2)

    # Paste the resized image onto the background
    background.paste(resized_image, paste_position)
    print(img.size)
    np_im = np.asarray(background)
    print(np.shape(np_im))
    mp_im = mpe.ImageClip(np_im).set_duration(duration).set_fps(30)
    return mp_im


clip1 = get_clip_from_path("static/images/pic1.png")
clip2 = get_clip_from_path("static/images/pic1.png")

fin_clip = editor.transition(clip1, clip2, 'color')

fin_clip.write_videofile("output.mp4", fps = 30)

