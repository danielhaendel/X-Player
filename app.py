from flask import Flask, render_template, request, send_from_directory
import os

app = Flask(__name__)

VIDEO_FOLDERS = {
    "offense": "static/videos/offense",
    "defense": "static/videos/defense",
    "specialteam": "static/videos/specialteam"
}

@app.route('/')
def index():
    folder = request.args.get('folder', 'offense')
    videos = sorted(os.listdir(VIDEO_FOLDERS[folder]))
    return render_template('index.html', folder=folder, videos=videos)

@app.route('/videos/<path:filename>')
def get_video(filename):
    folder = request.args.get('folder', 'offense')
    return send_from_directory(VIDEO_FOLDERS[folder], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, threaded=True)