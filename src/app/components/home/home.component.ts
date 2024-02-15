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
    const navigatorControl: any = navigator; navigatorControl.getUserMedia = (navigatorControl as any).getUserMedia || (navigatorControl as any).webkitGetUserMedia || (navigatorControl as any).mozGetUserMedia || (navigatorControl as any).msGetUserMedia || (navigatorControl as any).mediaDevices.getUserMedia;
    navigatorControl.mediaDevices.enumerateDevices().then((devices: any[]) => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const constraints: any = { audio: false, video: { width: { exact: 640 }, height: { exact: 640 * this.ratioFrame } }, };
      if (this.isMobile()) { constraints.video = { facingMode: 'enviroment', width: { exact: 640 * this.ratioFrame }, height: { exact: 640 }, }; }
      for (const device of videoDevices) {
        console.log(device)
        constraints.video.deviceId = device.deviceId; navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          const track = stream.getVideoTracks()[0]; const capabilities: any = track.getCapabilities(); console.log(capabilities)
          if (capabilities.focusMode && capabilities.facingMode && capabilities.focusMode.includes('continuous')) { this.handleStream(stream); console.log("camera suporta focusMode === 'continuous"); return } else { track.stop(); }
        })
      };
      delete constraints.video.deviceId;
      navigator.mediaDevices.getUserMedia(constraints).then(stream => this.handleStream(stream)).catch(console.log)
    })
  }
}
