const YTBtnContainer = document.getElementById('buttonYTContainer')

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('YTplayer', {
        playerVars: {
        'autoplay': 0,
        'controls': 1
        },
        events: {
        'onStateChange': onPlayerStateChange
        }
    });
}


YTBtnContainer.lastElementChild.addEventListener('click', e =>{
    const playid = getYouTubeId(YTBtnContainer.firstElementChild.value)
    if (playid){
        player.cueVideoById(playid)
        socket.emit('changeYT-ID', playid)
    }else{
        createMsg(`Youtube URL Video is not Vaild`, `notification`)
        socket.emit('sendNotification', `Youtube URL Video is not Vaild`, `notification` )
    }

    YTBtnContainer.firstElementChild.value = ""
})


socket.on('recieveChangeYT-ID', playId=>{
    player.cueVideoById(playId)
})


let lastTime = 0;
let seeking = false;


setInterval(() => {
  if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
    const currentTime = player.getCurrentTime();
    // Calculate difference between the video play
    if (Math.abs(currentTime - lastTime) > 5 && !seeking) {
      seeking = true;
      socket.emit('videoSeek', { time: currentTime });

      
      setTimeout(() => seeking = false, 1000);
    }
    lastTime = currentTime;
  }
}, 1000);


socket.on('recieveVideoSeek', data => {
    if (player) {
        player.seekTo(data.time, true);
    }
});


function onPlayerStateChange(event) {
  const state = event.data;

if (state == YT.PlayerState.PLAYING){
    socket.emit('videoPlay');
  }else if (state == YT.PlayerState.PAUSED){
    socket.emit('videoPause');
  }
}

socket.on('recieveVideoPlay', _=>{
    player.playVideo();
})

socket.on('recieveVideoPause', _=>{
    player.pauseVideo();
})


function getYouTubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}