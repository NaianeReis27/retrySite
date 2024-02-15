import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.startCamera()
  }
  ratioFrame = 0.7
  streams: any
  isMobile() { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); };


  handleStream(stream: any) { setTimeout(() => { let video: any = document.getElementById('video'); video.setAttribute('autoplay', ''); video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.srcObject = stream; this.streams = stream.getVideoTracks(); }, 1000); };
  startCamera() {
    const navigatorControl: any = navigator;
    navigatorControl.getUserMedia = (navigatorControl.getUserMedia ||
      navigatorControl.webkitGetUserMedia ||
      navigatorControl.mozGetUserMedia ||
      navigatorControl.msGetUserMedia ||
      navigatorControl.mediaDevices.getUserMedia).bind(navigatorControl);
  
    navigatorControl.mediaDevices.enumerateDevices()
      .then((devices: MediaDeviceInfo[]) => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: true 
        };
  
        if (this.isMobile()) {
          constraints.video = { facingMode: 'environment' };
        } else {
          constraints.video = {}; 
        }
  
        for (const device of videoDevices) {
           
          (constraints.video as MediaTrackConstraints).deviceId = { exact: device.deviceId }; 
          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
              this.handleStream(stream);
            })
            .catch(error => {
              console.error('Error accessing video device:', error);
            });
        }
  
        
        delete (constraints.video as MediaTrackConstraints).deviceId; 
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            const track = stream.getVideoTracks()[0];
                const capabilities: any = track.getCapabilities();

                console.log("Stream Video Tracks:", stream.getVideoTracks());
                console.log("Focus Mode:", capabilities.focusMode);
                console.log("Facing Mode:", capabilities.facingMode);

                if (capabilities.focusMode && capabilities.facingMode &&
                    capabilities.focusMode.includes('continuous') &&
                    capabilities.facingMode.includes('environment')) {
                    this.handleStream(stream)
                    return
                } else {
                    track.stop();
                }
          })
          .catch(error => {
            console.error('Error accessing video device:', error);
          });
      })
      .catch((error: any) => {
        console.error('Error enumerating devices:', error);
      });
  }
}
