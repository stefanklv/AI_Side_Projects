import cv2
import os

def sanitize_path(path):
    # Remove quotes and leading/trailing whitespace
    return path.strip().strip('"').strip("'")

def capture_frames(video_path, output_folder, interval=10):
    # Sanitize paths
    video_path = sanitize_path(video_path)
    output_folder = sanitize_path(output_folder)

    print(f"Video path: {video_path}")
    print(f"Output folder: {output_folder}")

    # Check if video file exists
    if not os.path.isfile(video_path):
        print(f"Error: Video file does not exist: {video_path}")
        return

    # Create the output folder if it doesn't exist
    try:
        os.makedirs(output_folder, exist_ok=True)
    except OSError as e:
        print(f"Error creating output folder: {e}")
        return

    # Open the video file
    try:
        video = cv2.VideoCapture(video_path)
    except Exception as e:
        print(f"Error opening video file: {e}")
        return

    # Get video properties
    fps = video.get(cv2.CAP_PROP_FPS)
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps

    print(f"Video FPS: {fps}")
    print(f"Total frames: {frame_count}")
    print(f"Video duration: {duration:.2f} seconds")

    # Calculate the frame interval
    frame_interval = int(fps * interval)

    frame_number = 0
    saved_count = 0

    while True:
        # Read a frame
        success, frame = video.read()

        if not success:
            break

        # If we're at the right interval, save the frame
        if frame_number % frame_interval == 0:
            timestamp = frame_number / fps
            filename = f"frame_{saved_count:03d}_{timestamp:.2f}s.jpg"
            filepath = os.path.join(output_folder, filename)
            try:
                cv2.imwrite(filepath, frame)
                print(f"Saved {filename}")
                saved_count += 1
            except Exception as e:
                print(f"Error saving frame {filename}: {e}")

        frame_number += 1

    # Release the video capture object
    video.release()

    print(f"Finished. Saved {saved_count} frames.")

# Usage
video_path = input("Enter the path to your video file: ")
output_folder = input("Enter the path for the output folder: ")

capture_frames(video_path, output_folder)