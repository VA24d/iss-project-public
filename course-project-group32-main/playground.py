from moviepy.editor import ImageClip, CompositeVideoClip
from moviepy.video.fx import resize

# Load your image clips
image1 = ImageClip("static/images/cropped-1920-1080-641975.jpg", duration=3)  # Duration in seconds
image2 = ImageClip("static/images/cropped-1920-1080-641975.jpg", duration=3)

# Define the duration of the transition
transition_duration = 1.5

# Define the scaling factors for the zoom transition
start_scale = 1.0
end_scale = 1.5

# Resize images to ensure they have the same dimensions
image1_resized = image1.resize((image2.w, image2.h))
image2_resized = image2.resize((image1.w, image1.h))

# Create a CompositeVideoClip for the transition
zoom_transition = CompositeVideoClip([
    resize(image1_resized, lambda t: start_scale + (end_scale - start_scale) * min(t / transition_duration, 1)),
    resize(image2_resized, lambda t: start_scale + (end_scale - start_scale) * max(1 - (t - image1.duration) / transition_duration, 0))
])

# Concatenate the transition with the original images
final_clip = CompositeVideoClip([image1, zoom_transition.set_duration(transition_duration), image2.set_start(image1.duration + transition_duration)])

# Write the final clip to a file
final_clip.write_videofile("output.mp4", fps=24)  # Adjust fps as needed
