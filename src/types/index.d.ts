declare global {
  interface Window {
    BMapGL: {
      Map: new (container: string | HTMLDivElement) => BMapGL.Map
      [propName: string]: any
    }
    BMapLib: any
    BMapGLLib: any
  }

  namespace BMapGL {
   interface Map {
    centerAndZoom(center: string | PointInstance, zoom: number): void
    enableScrollWheelZoom(enable?: boolean): void
    addControl(control: Control): void
    addOverlay(overlay: MarkerInstance | PolylineInstance): void
    removeOverlay(overlay: MarkerInstance | PolylineInstance): void
    addEventListener(event: string, callback: (e: any) => void): void
    clearOverlays():void
  }
  }
}

export {}
