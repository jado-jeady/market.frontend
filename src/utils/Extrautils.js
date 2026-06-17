export const toggleFullscreenTerminal = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable fullscreen mode: ${err.message}`,
      );
    });
  } else {
    document.exitFullscreen();
  }
};
