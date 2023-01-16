# HLS VARIANT INFO

## Features

1. Calculate bitrate of each stream variant segment.
2. Aggregate min, max and average bitrate values for each stream variant.
3. Compute VMAF score for each stream variant.

## Prerequisites

1. [Docker](https://www.docker.com)
2. [Node package manager](https://www.npmjs.com)

## Installation

1. Clone repository

    ```zsh
    git clone https://github.com/maciej-kulon/hls-variants-info.git ~/Documents/repos/hls-variants-info
    ```

2. Enter project directory
  
    ```zsh
    cd ~/Documents/repos/hls-variants-info
    ```

3. Run command

    ```zsh
    npm install && npm run docker
    ```
    <span style="color:yellow" >PLEASE NOTICE</span>: Building docker image for the first time may take up to an hour or even longer, depending on your hardware. FFmpeg with lots of enabled libraries and VMAF are compiled from source during docker build process.

## Usage

If `npm run docker` command ended successfully tool is ready to be used.

## Segments bitrates measurement

To measure segments bitrate values, min, max and average, HTTP request has to be send to <http://localhost:3000> on `hls-manifest` endpoint with `x-manifest-url` header pointing to HLS **MasterPlaylist** file.

```zsh
curl  -X POST http://localhost:3000/hls-manifest \
-H "x-manifest-url: http://example.hlsmanifest.m3u8" \
```

## VMAF score
<p align="center">
<img src="https://raw.githubusercontent.com/Netflix/vmaf/master/resource/images/vmaf_logo.jpg" alt="drawing" width="100"/>
</p>


To perform VMAF assessment on your stream variants, send additional header: `x-original-video-url` pointing to original video file from which HLS **MasterPlaylist** has been created. Application take care of input data normalization. If distorted video (I assume it's HLS manifest) has different resolution or frame rate, app will scale distorted video to match the original video resolution. Frame rate will be set to a lower value, so if original video for some reason has lower framerate, then distorted video framerate will be decreased to match original one and the other way around.

## Browsing results

All results are stored in local instance of MongoDB in docker. You can browse result using such software as [MongoDB Compass](https://www.mongodb.com/products/compass), [MongoDB Shell](https://www.mongodb.com/try/download/shell) or any other tool. Connect to the mongo DB using connection string:
`mongodb://root:root@$0.0.0.0:27017/hls-variants-info?tls=false&ssl=false&authSource=admin`

## Example results

Main document is a HLS MasterPlaylist. It has uri field which is basically a URL provided in `x-manifest-url` header. Inside there is an array of Variants, each variant contains segments with their measured bitrates.
![mongo1](images/mongo1.png)

Under the segments array some additional data is provided such as min, max and average bitrate from all stream variant segments.

![mongo2](images/mongo2.png)

Passing `x-original-video-url` will result in additional field **`vmafScore`** in each stream variant document.

## This project was built on top of other awesome opensource projects

Such as:

<div>
  <img style="vertical-align:middle" src="https://raw.githubusercontent.com/Netflix/vmaf/master/resource/images/vmaf_logo.jpg" width=100 alt="A grey image showing text 60 x 60">
  <a href="https://github.com/Netflix/vmaf">VMAF - Video Multi-Method Assessment Fusion</a>
</div>

<div>
  <img style="vertical-align:middle" src="https://1000logos.net/wp-content/uploads/2021/05/GitHub-logo.png" width=100 alt="A grey image showing text 60 x 60">
  <a href="https://github.com/jrottenberg/ffmpeg">  jrottenberg - github user with awesome docker solutions</a>
</div>

<div>
  <img style="vertical-align:middle" src="https://logo-download.com/wp-content/data/images/png/FFmpeg-logo.png" width=100 alt="A grey image showing text 60 x 60">
  <a href="https://ffmpeg.org">Ffmpeg - A complete, cross-platform solution to record, convert and stream audio and video.</a>
</div>
