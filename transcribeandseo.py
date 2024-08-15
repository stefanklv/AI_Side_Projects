import os
from openai import OpenAI
from pydub import AudioSegment

# Set up OpenAI client
client = OpenAI()

# Set ffmpeg and ffprobe path
ffmpeg_path = "C:/ffmpeg-7.0.1-essentials_build/ffmpeg-7.0.1-essentials_build/bin/ffmpeg.exe"
ffprobe_path = "C:/ffmpeg-7.0.1-essentials_build/ffmpeg-7.0.1-essentials_build/bin/ffprobe.exe"

# Set environment variables
os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
os.environ["FFMPEG_BINARY"] = ffmpeg_path
os.environ["FFPROBE_BINARY"] = ffprobe_path

# Debugging: print paths to ffmpeg and ffprobe
print(f"FFmpeg path: {ffmpeg_path}")
print(f"FFprobe path: {ffprobe_path}")

# Assign paths to pydub
AudioSegment.converter = ffmpeg_path
AudioSegment.ffprobe = ffprobe_path

def extract_audio(video_path):
    try:
        print(f"Attempting to extract audio from: {video_path}")
        
        # Normalize the path
        video_path = os.path.normpath(video_path)
        print(f"Normalized path: {video_path}")
        
        # Remove any surrounding quotes
        video_path = video_path.strip('"')
        print(f"Stripped path: {video_path}")
        
        # Check if the file exists
        if not os.path.isfile(video_path):
            print(f"File not found: {video_path}")
            return None

        # Get the absolute path for further verification
        absolute_path = os.path.abspath(video_path)
        print(f"Absolute path: {absolute_path}")
        
        # List contents of the directory for verification
        directory = os.path.dirname(absolute_path)
        directory_contents = os.listdir(directory)
        print(f"Contents of the directory ({directory}): {directory_contents}")

        # Get the file extension
        _, ext = os.path.splitext(video_path)
        print(f"File extension: {ext}")
        
        # Remove the leading dot from the extension
        ext = ext[1:] if ext.startswith('.') else ext
        print(f"Extension for pydub: {ext}")
        
        # Debugging: print ffmpeg and ffprobe paths used by pydub
        print(f"Using ffmpeg at: {AudioSegment.converter}")
        print(f"Using ffprobe at: {AudioSegment.ffprobe}")
        
        audio = AudioSegment.from_file(video_path, format=ext)
        audio_path = os.path.splitext(video_path)[0] + '.mp3'
        print(f"Exporting audio to: {audio_path}")
        audio.export(audio_path, format="mp3")
        print("Audio extraction successful")
        return audio_path
    except Exception as e:
        print(f"Error extracting audio: {e}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        return None

def split_audio(audio_path, chunk_length_ms=60000):  # 60000 ms = 1 minute
    audio = AudioSegment.from_mp3(audio_path)
    chunks = []
    for i in range(0, len(audio), chunk_length_ms):
        chunk = audio[i:i+chunk_length_ms]
        chunk_path = f"{audio_path[:-4]}_chunk_{i//chunk_length_ms}.mp3"
        chunk.export(chunk_path, format="mp3")
        chunks.append(chunk_path)
    return chunks

def transcribe_audio(audio_path):
    chunks = split_audio(audio_path)
    full_transcript = ""
    
    for chunk in chunks:
        with open(chunk, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )
        full_transcript += transcript.text + " "
        
        # Remove the temporary chunk file
        os.remove(chunk)
    
    return full_transcript.strip()

def generate_seo_suggestions(transcript):
    prompt = f"Based on the following video transcript, generate 5 SEO-optimized suggestions for the video's title, description, and tags. Each suggestion should be in this format:\n\nTitle: <video title>\nDescription: <video description>\nTags: <video tags in a copyable format, minimum 500 characters total>\n\nTranscript: {transcript[:4000]}"

    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates SEO suggestions for videos."},
            {"role": "user", "content": prompt}
        ],
        stream=True
    )

    full_response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            full_response += chunk.choices[0].delta.content
            print(chunk.choices[0].delta.content, end="", flush=True)

    return full_response

def main():
    video_path = input("Enter the path to your video file (use double quotes if the path contains spaces): ").strip()
    # Remove any surrounding quotes
    video_path = video_path.strip('"')
    
    print(f"User-provided path: {video_path}")
    
    # Check if the file exists before proceeding
    if not os.path.isfile(video_path):
        print(f"File not found: {video_path}")
        return
    
    print("Extracting audio...")
    audio_path = extract_audio(video_path)
    
    if audio_path is None:
        print("Audio extraction failed. Please check the video file and try again.")
        return

    print("Transcribing audio...")
    transcript = transcribe_audio(audio_path)
    
    print("Generating SEO suggestions...")
    seo_suggestions = generate_seo_suggestions(transcript)
    
    # Determine the directory of the video file
    output_dir = os.path.dirname(video_path)
    
    # Save transcript
    transcript_path = os.path.join(output_dir, 'transcript.txt')
    with open(transcript_path, 'w', encoding='utf-8') as f:
        f.write(transcript)
    
    # Save SEO suggestions
    seo_suggestions_path = os.path.join(output_dir, 'seo_suggestions.txt')
    with open(seo_suggestions_path, 'w', encoding='utf-8') as f:
        f.write(seo_suggestions)
    
    print(f"\nDone! Check '{transcript_path}' for the full transcription and '{seo_suggestions_path}' for SEO suggestions.")
    input("Press Enter to exit.")

if __name__ == "__main__":
    main()
