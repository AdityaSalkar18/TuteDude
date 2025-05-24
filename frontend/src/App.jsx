
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const videos = [
    { id: 'video1.mp4', title: '1. What is React' },
    { id: 'video2.mp4', title: '2. What is MongoDB' },
    { id: 'video3.mp4', title: '3. Introduction to Express' },
    { id: 'video4.mp4', title: '4. Introduction to Node.js' },
    { id: 'video5.mp4', title: '5. What is Full Stack' },
  ];

  const [selectedVideo, setSelectedVideo] = useState(videos[0].id);
  const [progress, setProgress] = useState({});
  const videoRef = useRef(null);

  const userid = 'user123';
  const userName = 'Aditya Salkar';

  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/video/progress/${userid}`);
        const progressMap = {};
        res.data.forEach((entry) => {
          progressMap[entry.videoid] = entry.videoprogress;
        });
        setProgress(progressMap);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    fetchProgress();
  }, [userid]);

 
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const savedProgress = progress[selectedVideo];
      if (savedProgress && video.duration) {
        const resumeTime = (savedProgress / 100) * video.duration;
        video.currentTime = resumeTime;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [selectedVideo, progress]);


  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    const rounded = Math.floor(percent);

    try {
      await axios.patch(`http://localhost:8000/api/video/save`, {
        userid,
        userName,
        videoid: selectedVideo,
        videotitle: videos.find((v) => v.id === selectedVideo)?.title,
        videolength: Math.floor(video.duration),
        videolastWatchedTime: Math.floor(video.currentTime),
        videoprogress: rounded,
      });

      setProgress((prev) => ({
        ...prev,
        [selectedVideo]: rounded,
      }));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  return (
    <>
     
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3">
            <span className="text-2xl text-gray-700 font-semibold">TuteDude</span>
          </a>
          <div className="flex items-center space-x-2">
            <img
              src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
              className="h-9 w-9 rounded-full border border-gray-700"
              alt="User"
            />
            <p>{userName}</p>
          </div>
        </div>
      </nav>

      
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="flex flex-col md:flex-row gap-8">
        
          <div className="flex-1">
            <video
              ref={videoRef}
              src={`/videos/${selectedVideo}`}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="w-full rounded shadow"
            />
          </div>

          
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Video List</h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className={`p-4 border rounded shadow cursor-pointer ${
                    selectedVideo === video.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <p className="text-lg font-medium">{video.title}</p>
                  <div className="w-full bg-gray-200 rounded h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded"
                      style={{ width: `${progress[video.id] || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {progress[video.id] || 0}% completed
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
