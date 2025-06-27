import React, { useRef, useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { playerActions } from "../../store/player";

const AudioPlayer = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const dispatch = useDispatch();
  const playerDivState = useSelector((state) => state.player.isPlayerDiv);
  const songPath = useSelector((state) => state.player.songPath);
  const currentImage = useSelector((state) => state.player.img);

  const audioRef = useRef(null);

  // Format time in mm:ss
  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Close the player
  const closeAudioPlayer = (e) => {
    e.preventDefault();
    dispatch(playerActions.closeDiv());
    dispatch(playerActions.changeImage(""));
    dispatch(playerActions.changeSong(""));
    setIsAudioPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Play or pause audio
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.error("Playback failed", error));
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  // Update time while playing
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Set metadata on load
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Rewind 10 seconds
  const handleBackward = () => {
    if (audioRef.current) {
      let newTime = Math.max(currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Fast-forward 10 seconds
  const handleForward = () => {
    if (audioRef.current) {
      let newTime = Math.min(currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Seek using progress bar
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Load song when songPath changes
  useEffect(() => {
    if (songPath && audioRef.current) {
      audioRef.current.src = songPath;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
    }
  }, [songPath]);

  // Attach event listeners
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  return (
    <div
      className={`${
        playerDivState ? "fixed" : "hidden"
      } bottom-0 left-0 w-full bg-zinc-900 text-white py-6 flex items-center gap-4 px-4`}
    >
      {/* Image Section */}
      <div className="hidden md:block w-1/3">
        {currentImage ? (
          <img src={currentImage} className="size-24 mx-4 rounded-full object-cover" alt="album cover" />
        ) : (
          <div className="size-24 mx-4 rounded-full bg-gray-700 flex items-center justify-center">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center gap-4 text-xl">
          <button onClick={handleBackward}>
            <IoPlaySkipBack />
          </button>
          <button onClick={handlePlayPause}>
            {isAudioPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleForward}>
            <IoPlaySkipForward />
          </button>
        </div>
        <div className="w-full flex items-center mt-4 justify-center">
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            className="w-full cursor-pointer"
            onChange={handleSeek}
          />
        </div>
        <div className="w-full flex justify-between items-center text-sm">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Close Button */}
      <div className="w-1/3 flex items-center justify-end">
        <button onClick={closeAudioPlayer}>
          <ImCross />
        </button>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioPlayer;
