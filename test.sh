#!/bin/sh
curl  -X POST http://localhost:3000/hls-manifest -H "x-manifest-url: url"