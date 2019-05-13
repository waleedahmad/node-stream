### NodeStream

See complete tutorial [here](https://www.google.com).


#### Install ffmpeg for RTMP to HLS transcoding 

```
# On Ubuntu 18.04

$ sudo add-apt-repository ppa:jonathonf/ffmpeg-4
$ sudo apt install ffmpeg

# check version
$ ffmpeg --version

# You can download Windows builds from ffmpeg site.
```

#### Configuration
Change ffmpeg path in node media server configuration to your
own installed path.

Also change secret string. It will be used for session encryption.

```
cd nodeStream && nano /server/config/default.js

const config = {
    server: {
        secret: 'kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc'
    },
    rtmp_server: {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30
        },
        http: {
            port: 8888,
            mediaroot: './server/media',
            allow_origin: '*'
        },
        trans: {
            ffmpeg: '/usr/bin/ffmpeg',
            tasks: [
                {
                    app: 'live',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        }
    }
};
```

#### Install dependencies, build code and run server
```
$ npm install

# run webpack and watch for changes
$ npm run watch 

# run node server with supervisor and watch for changes
$ npm run start
```
