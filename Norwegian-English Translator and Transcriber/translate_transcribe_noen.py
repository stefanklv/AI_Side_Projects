import os
from pydub import AudioSegment
import speech_recognition as sr

# Manually input the path to your audio file
audio_file_path = input("Please enter the path to your audio file: ").strip()
audio_file_path = audio_file_path.strip('\"')  # Strip any quotes

# Print the file path for debugging purposes
print(f"Processed file path: {audio_file_path}")

# Check if the file exists
if not os.path.exists(audio_file_path):
    raise FileNotFoundError(f"The file {audio_file_path} does not exist.")

# Load the audio file using pydub
try:
    audio = AudioSegment.from_file(audio_file_path)
except OSError as e:
    print(f"An error occurred while trying to read the file: {e}")
    raise

# Define the length of each segment in milliseconds (e.g., 30 seconds)
segment_length_ms = 30000  # 30 seconds
segments = [audio[i:i + segment_length_ms] for i in range(0, len(audio), segment_length_ms)]

# Initialize recognizer
recognizer = sr.Recognizer()

transcript_full = []
timestamps = []

# Process each segment
for i, segment in enumerate(segments):
    # Calculate start and end time in milliseconds
    segment_start_time = i * segment_length_ms
    segment_end_time = segment_start_time + len(segment)
    
    # Convert to SRT time format (hh:mm:ss,ms)
    start_time_srt = f"{segment_start_time//3600000:02}:{(segment_start_time//60000)%60:02}:{(segment_start_time//1000)%60:02},{segment_start_time%1000:03}"
    end_time_srt = f"{segment_end_time//3600000:02}:{(segment_end_time//60000)%60:02}:{(segment_end_time//1000)%60:02},{segment_end_time%1000:03}"

    # Export segment to a temporary file
    segment_path = f"segment_{i}.wav"
    segment.export(segment_path, format="wav")
    
    # Recognize speech in English
    try:
        with sr.AudioFile(segment_path) as source:
            audio_data = recognizer.record(source)
            transcript_segment = recognizer.recognize_google(audio_data, language="en-US")
            transcript_full.append(transcript_segment)
            timestamps.append((start_time_srt, end_time_srt))
            print(f"Transcript for segment {i+1}: {transcript_segment}")
    except sr.UnknownValueError:
        print(f"Google Speech Recognition could not understand segment {i+1}")
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service for segment {i+1}; {e}")
        break  # Stop processing if there's a request error

# Combine the transcripts and timestamps
transcript_english = ". ".join(transcript_full) + "."

# Only proceed if transcription was successful
if transcript_english:
    # Generate SRT format
    def generate_srt(transcript, timestamps):
        srt_output = ""
        for i, (line, (start_time_srt, end_time_srt)) in enumerate(zip(transcript.split(". "), timestamps)):
            srt_output += f"{i+1}\n"
            srt_output += f"{start_time_srt} --> {end_time_srt}\n"
            srt_output += f"{line.strip()}.\n\n"
        return srt_output

    # Generate SRT
    srt_content = generate_srt(transcript_english, timestamps)

    # Save to a file
    with open("output_subtitles.srt", "w", encoding="utf-8") as srt_file:
        srt_file.write(srt_content)

    print("Subtitles saved to 'output_subtitles.srt'")
else:
    print("Transcription failed. SRT file was not created.")
