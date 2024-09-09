let toggleButton = document.getElementById("toggleButton");
let hide_items = document.getElementsByClassName("hide-items")

toggleButton.addEventListener("click", () => {
    for(let val of hide_items) {
        val.classList.toggle("hidden-content");
    }
})

// ! API Intergration

/**
 * 1. Google Cloud
    a. search google cloud
    https://cloud.google.com/    
    
    2. YouTube Data API
    a. Search youtube data api
    https://developers.google.com/youtube/v3

 */

let api_key = "AIzaSyB9FjiHSAeYMqb2mMQfB3aIY5UujYVXRHQ";
let search_http = "https://www.googleapis.com/youtube/v3/search?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";


let callGeneralApi = async () => {

    let searchParams = new URLSearchParams({
        key: api_key,
        part: "snippet",
        maxResults: 10,
        type: "video",
        regionCode: "IN",
    });

    let res = await fetch(search_http + searchParams);
    let data = await res.json();

    data.items.map(item => {
        getChannelIcon(item)
    })
}
callGeneralApi(); // I am calling for default content

let callYouTubeDataAPI = async (query) => {

    let searchParams = new URLSearchParams({
        key: api_key,
        part: "snippet",
        q: query,
        maxResults: 10,
        type: "video",
        regionCode: "IN",
    });

    let res = await fetch(search_http + searchParams);
    let data = await res.json();

    data.items.map(item => {
        getChannelIcon(item)
    })
}

// ? to get channel icon based on channel ID
let getChannelIcon = async (video_data) => {

    let channelParams = new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video_data.snippet.channelId,
    });
    let res = await fetch(channel_http+channelParams);
    let data = await res.json();
    video_data.channelIconImage = data.items[0].snippet.thumbnails.default.url;
    appendVideoInToContainer(video_data);
}

let video_container = document.getElementById("video-card-container");
video_container.innerHTML = "";

let appendVideoInToContainer = (video_data) => {

    let {
        channelIconImage,
        id : { 
            videoId
        },
        snippet: {
            title,
            channelTitle,
            description,
            thumbnails : {
                high: {
                    url,
                    width,
                    height
                }
            }
        },
    }  = video_data;

    video_container.innerHTML += `
        <div class="video-card-item">
            <a class="thumbnail" href="https://www.youtube.com/watch?v=${videoId}">
                <img class="thumbnail-image" src="${url}" alt="">
            </a>
            <div class="video-bottom-container">
                <a>
                    <img class="channel-icon" src="${channelIconImage}" alt="">
                </a>
                <div class="video-details">
                    <a href="#" class="video-title">${title}</a>
                    <a href="#" class="video-channel-name">${channelTitle}</a>
                    <div class="video-metadata">
                        <span>12K views</span>
                        •
                        <span>1 week ago</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let search_button = document.getElementById("search_button");

search_button.addEventListener("click", () => {
    let user_input = document.getElementById("user_input").value;

    // Clear previous search results
    video_container.innerHTML = "";

    callYouTubeDataAPI(user_input);
});