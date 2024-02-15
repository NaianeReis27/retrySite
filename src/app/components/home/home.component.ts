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
          constraints.video = { facingMode: 'environment' }; // Assign the constraints object
        } else {
          constraints.video = {}; // Initialize as empty object
        }
  
        for (const device of videoDevices) {
           
          (constraints.video as MediaTrackConstraints).deviceId = { exact: device.deviceId }; // Type assertion here
  
          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
              this.handleStream(stream);
            })
            .catch(error => {
              console.error('Error accessing video device:', error);
            });
        }
  
        // If no specific device is selected, try to get any available video stream
        delete (constraints.video as MediaTrackConstraints).deviceId; // Type assertion here
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            this.handleStream(stream);
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
